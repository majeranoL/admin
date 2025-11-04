import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  listAll 
} from 'firebase/storage'
import { storage } from '../config/firebase'

export const storageService = {
  // Upload a file
  async uploadFile(file, path, onProgress = null) {
    try {
      const storageRef = ref(storage, path)
      
      if (onProgress) {
        // Upload with progress tracking
        const uploadTask = uploadBytesResumable(storageRef, file)
        
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              onProgress(progress)
            },
            (error) => {
              console.error('Upload error:', error)
              reject(error)
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              resolve({ url: downloadURL, path })
            }
          )
        })
      } else {
        // Simple upload without progress
        await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(storageRef)
        return { url: downloadURL, path }
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  },

  // Upload an image (with size validation)
  async uploadImage(file, folder = 'images', maxSizeMB = 5) {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > maxSizeMB) {
        throw new Error(`File size must be less than ${maxSizeMB}MB`)
      }

      // Generate unique filename
      const timestamp = Date.now()
      const fileName = `${timestamp}_${file.name}`
      const path = `${folder}/${fileName}`

      return await this.uploadFile(file, path)
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  },

  // Upload multiple files
  async uploadMultiple(files, folder = 'files', onProgress = null) {
    try {
      const uploadPromises = files.map((file, index) => {
        const timestamp = Date.now()
        const fileName = `${timestamp}_${index}_${file.name}`
        const path = `${folder}/${fileName}`
        
        return this.uploadFile(file, path, onProgress ? (progress) => {
          onProgress(index, progress)
        } : null)
      })

      return await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Error uploading multiple files:', error)
      throw error
    }
  },

  // Delete a file
  async deleteFile(path) {
    try {
      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
      return { path, deleted: true }
    } catch (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  },

  // Get download URL for a file
  async getFileURL(path) {
    try {
      const storageRef = ref(storage, path)
      const url = await getDownloadURL(storageRef)
      return url
    } catch (error) {
      console.error('Error getting file URL:', error)
      throw error
    }
  },

  // List all files in a folder
  async listFiles(folderPath) {
    try {
      const folderRef = ref(storage, folderPath)
      const result = await listAll(folderRef)
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef)
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            url
          }
        })
      )
      
      return files
    } catch (error) {
      console.error('Error listing files:', error)
      throw error
    }
  }
}

// Specific upload helpers
export const imageUploadService = {
  uploadAnimalPhoto: (file) => storageService.uploadImage(file, 'animals'),
  uploadVolunteerPhoto: (file) => storageService.uploadImage(file, 'volunteers'),
  uploadShelterLogo: (file) => storageService.uploadImage(file, 'shelters'),
  uploadReportPhoto: (file) => storageService.uploadImage(file, 'reports')
}
