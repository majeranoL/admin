import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../config/firebase'
import AuditLogService from '../services/auditLogService'
import logo from '../assets/animal911logo.png'
import '../css/ShelterRegistration.css'

function ShelterRegistration() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  // Form state
  const [formData, setFormData] = useState({
    shelterName: '',
    contactPerson: '',
    address: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    vetName: '',
    vetContact: '',
    vetLicense: '',
    agreeTerms: false
  })

  // File uploads
  const [permitFile, setPermitFile] = useState(null)
  const [idFile, setIdFile] = useState(null)

  // UI states
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle file changes
  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [type]: 'File size must be less than 5MB'
        }))
        return
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [type]: 'Only JPG, PNG, or PDF files are allowed'
        }))
        return
      }

      if (type === 'permit') {
        setPermitFile(file)
      } else {
        setIdFile(file)
      }
      
      // Clear error
      if (errors[type]) {
        setErrors(prev => ({ ...prev, [type]: '' }))
      }
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.shelterName.trim()) newErrors.shelterName = 'Shelter name is required'
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password'

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // Phone validation
    const phoneRegex = /^(\+63|0)[0-9]{10}$/
    if (formData.contactNumber && !phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Invalid phone number (use +639XXXXXXXXX or 09XXXXXXXXX)'
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Document uploads
    if (!permitFile) newErrors.permit = 'Shelter permit is required'
    if (!idFile) newErrors.id = 'Valid ID is required'

    // Terms agreement
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Upload file to Firebase Storage
  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitMessage('Please fix the errors in the form')
      setSubmitSuccess(false)
      return
    }

    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      // Step 1: Check if email already exists
      setUploadProgress(10)
      const emailQuery = query(
        collection(db, 'shelters'),
        where('email', '==', formData.email)
      )
      const existingUsers = await getDocs(emailQuery)
      
      if (!existingUsers.empty) {
        setSubmitMessage('This email is already registered. Please use a different email.')
        setSubmitSuccess(false)
        setIsSubmitting(false)
        return
      }

      // Step 2: Generate unique ID (timestamp-based)
      setUploadProgress(20)
      const userId = `shelter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Step 3: Upload documents
      setUploadProgress(40)
      const timestamp = Date.now()
      const permitURL = await uploadFile(
        permitFile,
        `shelters/${userId}/permit_${timestamp}.${permitFile.name.split('.').pop()}`
      )

      setUploadProgress(60)
      const idURL = await uploadFile(
        idFile,
        `shelters/${userId}/id_${timestamp}.${idFile.name.split('.').pop()}`
      )

      // Step 4: Save shelter data to Firestore
      setUploadProgress(80)
      const shelterData = {
        userId: userId,
        shelterName: formData.shelterName,
        contactPerson: formData.contactPerson,
        address: formData.address,
        contactNumber: formData.contactNumber,
        email: formData.email,
        password: formData.password, // Store password (Note: In production, consider hashing)
        veterinarian: {
          name: formData.vetName || null,
          contact: formData.vetContact || null,
          license: formData.vetLicense || null
        },
        documents: {
          permit: permitURL,
          validId: idURL
        },
        verified: false,
        status: 'pending',
        registeredAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await setDoc(doc(db, 'shelters', userId), shelterData)

      // Log the shelter registration
      await AuditLogService.logSystemEvent(
        'Shelter Registration',
        userId,
        formData.email,
        'shelter',
        {
          shelterName: formData.shelterName,
          contactPerson: formData.contactPerson,
          address: formData.address,
          contactNumber: formData.contactNumber,
          status: 'pending',
          documentsUploaded: true
        }
      )

      setUploadProgress(100)
      setSubmitSuccess(true)
      setSubmitMessage('Registration successful! Your application is pending admin approval.')

      // Reset form
      setTimeout(() => {
        navigate('/login')
      }, 3000)

    } catch (error) {
      console.error('Registration error:', error)
      setSubmitSuccess(false)
      setSubmitMessage('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`shelter-registration ${theme === 'light' ? 'light-mode' : 'dark-mode'}`}>
      <div className="registration-container">
        <div className="registration-header">
          <img src={logo} alt="Animal 911 Logo" className="registration-logo" />
          <h1>Partnering Shelter Registration</h1>
          <p>Join Animal 911 and help save more lives</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Shelter Information */}
          <div className="form-section">
            <h2><i className="bi bi-building"></i> Shelter Information</h2>
            
            <div className="form-group">
              <label htmlFor="shelterName">Shelter Name <span className="required">*</span></label>
              <input
                type="text"
                id="shelterName"
                name="shelterName"
                value={formData.shelterName}
                onChange={handleChange}
                placeholder="Enter shelter name"
                disabled={isSubmitting}
              />
              {errors.shelterName && <span className="error-text">{errors.shelterName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contactPerson">Contact Person <span className="required">*</span></label>
              <input
                type="text"
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Full name of contact person"
                disabled={isSubmitting}
              />
              {errors.contactPerson && <span className="error-text">{errors.contactPerson}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address <span className="required">*</span></label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Complete shelter address"
                rows="3"
                disabled={isSubmitting}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number <span className="required">*</span></label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+639XXXXXXXXX or 09XXXXXXXXX"
                  disabled={isSubmitting}
                />
                {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address <span className="required">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="shelter@example.com"
                  disabled={isSubmitting}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="form-section">
            <h2><i className="bi bi-shield-lock"></i> Account Security</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password <span className="required">*</span></label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  disabled={isSubmitting}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>

          {/* Veterinarian Information (Optional) */}
          <div className="form-section optional-section">
            <h2><i className="bi bi-heart-pulse"></i> Veterinarian Information <span className="optional-badge">Optional</span></h2>
            
            <div className="form-group">
              <label htmlFor="vetName">Veterinarian Name</label>
              <input
                type="text"
                id="vetName"
                name="vetName"
                value={formData.vetName}
                onChange={handleChange}
                placeholder="Name of affiliated veterinarian"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vetContact">Veterinarian Contact</label>
                <input
                  type="tel"
                  id="vetContact"
                  name="vetContact"
                  value={formData.vetContact}
                  onChange={handleChange}
                  placeholder="+639XXXXXXXXX"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="vetLicense">License Number</label>
                <input
                  type="text"
                  id="vetLicense"
                  name="vetLicense"
                  value={formData.vetLicense}
                  onChange={handleChange}
                  placeholder="Veterinarian license number"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="form-section">
            <h2><i className="bi bi-file-earmark-arrow-up"></i> Document Upload</h2>
            
            <div className="form-group">
              <label htmlFor="permitFile">
                Shelter Permit/Certificate <span className="required">*</span>
              </label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="permitFile"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileChange(e, 'permit')}
                  disabled={isSubmitting}
                />
                <label htmlFor="permitFile" className="file-upload-label">
                  <i className="bi bi-cloud-upload"></i>
                  {permitFile ? permitFile.name : 'Choose file (JPG, PNG, PDF - Max 5MB)'}
                </label>
              </div>
              {errors.permit && <span className="error-text">{errors.permit}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="idFile">
                Valid ID (Contact Person) <span className="required">*</span>
              </label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="idFile"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleFileChange(e, 'id')}
                  disabled={isSubmitting}
                />
                <label htmlFor="idFile" className="file-upload-label">
                  <i className="bi bi-cloud-upload"></i>
                  {idFile ? idFile.name : 'Choose file (JPG, PNG, PDF - Max 5MB)'}
                </label>
              </div>
              {errors.id && <span className="error-text">{errors.id}</span>}
            </div>
          </div>

          {/* Terms and Agreement */}
          <div className="form-section">
            <div className="terms-section">
              <div className="terms-checkbox">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="agreeTerms">
                  I agree to the <a href="#terms" target="_blank">Terms and Conditions</a> and 
                  <a href="#privacy" target="_blank"> Privacy Policy</a> <span className="required">*</span>
                </label>
              </div>
              {errors.agreeTerms && <span className="error-text">{errors.agreeTerms}</span>}

              <div className="terms-note">
                <i className="bi bi-info-circle"></i>
                <p>
                  By registering, you agree that Animal 911 will review your application. 
                  You will receive an email notification once your shelter is verified by the admin.
                  Only verified shelters can access the admin dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <div className={`submit-message ${submitSuccess ? 'success' : 'error'}`}>
              <i className={`bi ${submitSuccess ? 'bi-check-circle' : 'bi-exclamation-circle'}`}></i>
              {submitMessage}
            </div>
          )}

          {/* Upload Progress */}
          {isSubmitting && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <p>Processing registration... {uploadProgress}%</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              <i className="bi bi-arrow-left"></i> Back to Home
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle"></i> Submit Registration
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ShelterRegistration
