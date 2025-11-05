import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useRole } from "../hooks/useRole"
import { useTheme } from "../contexts/ThemeContext"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../config/firebase"
import logger from "../utils/logger"
import AuditLogService from "../services/auditLogService"
import logo from "../assets/animal911logo.png"

function LoginForm() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginMessage, setLoginMessage] = useState("")
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [isMessageVisible, setIsMessageVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useRole()
  const timeoutRef = useRef(null)
  const fadeTimeoutRef = useRef(null)

  // Function to set message with auto-clear timeout
  const setMessageWithTimeout = (message, isSuccess = false) => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current)
    }

    // Set the message and success state
    setLoginMessage(message)
    setLoginSuccess(isSuccess)
    setIsMessageVisible(true)

    // Set timeout to start fade-out after 2.7 seconds
    timeoutRef.current = setTimeout(() => {
      setIsMessageVisible(false)
      
      // Then completely remove message after fade animation (300ms)
      fadeTimeoutRef.current = setTimeout(() => {
        setLoginMessage("")
        setLoginSuccess(false)
        setIsMessageVisible(true) // Reset for next message
      }, 300)
    }, 2700)
  }

  // Cleanup timeouts on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username.trim() || !password.trim()) {
      setMessageWithTimeout("Please enter both username and password.", false)
      return
    }

    try {
      setIsLoading(true)

      // Check if user is a verified shelter (admin role)
      const sheltersQuery = query(
        collection(db, 'shelters'),
        where('email', '==', username.toLowerCase()),
        where('verified', '==', true)
      )
      const sheltersSnapshot = await getDocs(sheltersQuery)

      if (!sheltersSnapshot.empty) {
        const shelterDoc = sheltersSnapshot.docs[0]
        const shelterData = shelterDoc.data()

        // Check password field (stored during registration)
        // In production, use proper password hashing (bcrypt, argon2)
        if (shelterData.password && password === shelterData.password) {
          // Log successful login
          await AuditLogService.logAuthentication(
            'Login',
            shelterDoc.id,
            shelterData.email,
            true
          )
          
          setMessageWithTimeout("Login successful! Welcome to Animal911 Admin.", true)
          await new Promise(resolve => setTimeout(resolve, 1500))
          await login('admin', shelterData.shelterName, shelterDoc.id)
          logger.info("Shelter login successful:", { 
            shelterName: shelterData.shelterName,
            shelterId: shelterDoc.id 
          })
          return
        }
      }

      // Check if user is a super admin
      const adminsQuery = query(
        collection(db, 'admins'),
        where('email', '==', username.toLowerCase())
      )
      const adminsSnapshot = await getDocs(adminsQuery)

      if (!adminsSnapshot.empty) {
        const adminDoc = adminsSnapshot.docs[0]
        const adminData = adminDoc.data()

        // Check password field
        if (adminData.password && password === adminData.password) {
          // Log successful super admin login
          await AuditLogService.logAuthentication(
            'Super Admin Login',
            adminDoc.id,
            adminData.email,
            true
          )
          
          setMessageWithTimeout("Login successful! Welcome Super Admin.", true)
          await new Promise(resolve => setTimeout(resolve, 1500))
          await login('superadmin', adminData.name || 'Super Admin', adminDoc.id)
          logger.info("Super admin login successful:", { 
            adminName: adminData.name,
            adminId: adminDoc.id 
          })
          return
        }
      }

      // If no match found - Log failed login attempt
      await AuditLogService.logAuthentication(
        'Failed Login Attempt',
        'Unknown',
        username,
        false
      )
      
      setIsLoading(false)
      setMessageWithTimeout("Invalid credentials or account not verified.", false)

    } catch (error) {
      logger.error("Login error:", error)
      setIsLoading(false)
      setMessageWithTimeout("Login failed. Please try again.", false)
    }
  }

  return (
    <div className={`app ${theme === 'light' ? 'light-mode' : 'dark-mode'}`}>
      <div className="login-wrapper">
        <div className="login-container" style={{ position: 'relative' }}>
          <div className="login-form">
          <div className="logo">
              <img src={logo} alt="Animal 911 Logo" className="login-logo-img" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <button 
              type="button" 
              className="register-btn" 
              onClick={() => navigate('/register-shelter')}
              disabled={isLoading}
            >
              <i className="bi bi-building"></i> Register your Shelter
            </button>

            <div className="forgot-password">
              <a href="#forgot">Forgot Password?</a>
            </div>
          </form>
        </div>
      </div>

      {/* Error/Success message outside and below the login container */}
      {loginMessage && (
        <div 
          className={`login-message-external ${loginSuccess ? 'success' : 'error'}`}
          style={{ opacity: isMessageVisible ? 1 : 0 }}
        >
          {loginMessage}
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="login-loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner-large"></div>
            <h3>Preparing Dashboard...</h3>
            <p>Setting up your admin workspace</p>
            <div className="loading-progress-bar">
              <div className="loading-progress-fill"></div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default LoginForm