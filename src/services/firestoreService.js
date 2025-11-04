import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  startAfter,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Generic CRUD operations for any collection
export const firestoreService = {
  // Create a new document
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error)
      throw error
    }
  },

  // Read a single document by ID
  async getById(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        throw new Error('Document not found')
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error)
      throw error
    }
  },

  // Read all documents from a collection
  async getAll(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error)
      throw error
    }
  },

  // Query documents with conditions
  async query(collectionName, conditions = []) {
    try {
      let q = collection(db, collectionName)
      
      if (conditions.length > 0) {
        q = query(q, ...conditions)
      }
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error)
      throw error
    }
  },

  // Update a document
  async update(collectionName, id, data) {
    try {
      const docRef = doc(db, collectionName, id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      })
      return { id, ...data }
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error)
      throw error
    }
  },

  // Delete a document
  async delete(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id)
      await deleteDoc(docRef)
      return { id, deleted: true }
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error)
      throw error
    }
  },

  // Get documents with pagination
  async getPaginated(collectionName, pageSize = 10, lastDoc = null) {
    try {
      let q = query(
        collection(db, collectionName),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      )
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc))
      }
      
      const querySnapshot = await getDocs(q)
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
      
      return {
        docs,
        lastVisible,
        hasMore: docs.length === pageSize
      }
    } catch (error) {
      console.error(`Error getting paginated documents from ${collectionName}:`, error)
      throw error
    }
  }
}

// Specific collection services
export const rescueReportsService = {
  getAll: () => firestoreService.getAll('rescueReports'),
  getById: (id) => firestoreService.getById('rescueReports', id),
  create: (data) => firestoreService.create('rescueReports', data),
  update: (id, data) => firestoreService.update('rescueReports', id, data),
  delete: (id) => firestoreService.delete('rescueReports', id),
  getByStatus: (status) => firestoreService.query('rescueReports', [where('status', '==', status)])
}

export const volunteersService = {
  getAll: () => firestoreService.getAll('volunteers'),
  getById: (id) => firestoreService.getById('volunteers', id),
  create: (data) => firestoreService.create('volunteers', data),
  update: (id, data) => firestoreService.update('volunteers', id, data),
  delete: (id) => firestoreService.delete('volunteers', id),
  getByStatus: (status) => firestoreService.query('volunteers', [where('status', '==', status)])
}

export const animalsService = {
  getAll: () => firestoreService.getAll('animals'),
  getById: (id) => firestoreService.getById('animals', id),
  create: (data) => firestoreService.create('animals', data),
  update: (id, data) => firestoreService.update('animals', id, data),
  delete: (id) => firestoreService.delete('animals', id),
  getByStatus: (status) => firestoreService.query('animals', [where('status', '==', status)])
}

export const adoptionRequestsService = {
  getAll: () => firestoreService.getAll('adoptionRequests'),
  getById: (id) => firestoreService.getById('adoptionRequests', id),
  create: (data) => firestoreService.create('adoptionRequests', data),
  update: (id, data) => firestoreService.update('adoptionRequests', id, data),
  delete: (id) => firestoreService.delete('adoptionRequests', id),
  getByStatus: (status) => firestoreService.query('adoptionRequests', [where('status', '==', status)])
}

export const sheltersService = {
  getAll: () => firestoreService.getAll('shelters'),
  getById: (id) => firestoreService.getById('shelters', id),
  create: (data) => firestoreService.create('shelters', data),
  update: (id, data) => firestoreService.update('shelters', id, data),
  delete: (id) => firestoreService.delete('shelters', id),
  getVerified: () => firestoreService.query('shelters', [where('verified', '==', true)])
}

export const adminsService = {
  getAll: () => firestoreService.getAll('admins'),
  getById: (id) => firestoreService.getById('admins', id),
  create: (data) => firestoreService.create('admins', data),
  update: (id, data) => firestoreService.update('admins', id, data),
  delete: (id) => firestoreService.delete('admins', id)
}
