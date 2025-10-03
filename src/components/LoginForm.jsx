import { useState, useEffect, useRef } from "react"
import { useRole } from "../hooks/useRole"
import logger from "../utils/logger"

function LoginForm() {
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

  // Dummy login credentials
  const dummyCredentials = {
    admin: {
      username: "admin",
      password: "admin123",
      role: "admin"
    },
    superadmin: {
      username: "superadmin", 
      password: "super123",
      role: "superadmin"
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check against dummy credentials
    if (username.trim() && password.trim()) {
      let isLoginSuccessful = false
      let userRole = "admin"
      
      // Check if credentials match any dummy account
      Object.values(dummyCredentials).forEach(account => {
        if (username.toLowerCase() === account.username && password === account.password) {
          isLoginSuccessful = true
          userRole = account.role
        }
      })
      
      if (isLoginSuccessful) {
        try {
          // Start loading immediately
          setIsLoading(true)
          setMessageWithTimeout("Login successful! Welcome to Animal911 Admin.", true)
          
          // Add a delay to allow dashboard components to prepare
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          // Use the context login function
          await login(userRole, username)
          
          logger.info("Login successful:", { username, userRole })
        } catch (error) {
          logger.error("Login error:", error)
          setIsLoading(false)
          setMessageWithTimeout("Login failed. Please try again.", false)
        }
      } else {
        setMessageWithTimeout("Invalid username or password.", false)
      }
    } else {
      setMessageWithTimeout("Please enter both username and password.", false)
    }
  }

  return (
    <div className="app">
      <div className="login-wrapper">
        <div className="login-container" style={{ position: 'relative' }}>
          <div className="login-form">
          <div className="logo">
            <h1>Animal911</h1>
            <p>Admin Login</p>
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
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <button type="button" className="register-btn" disabled={isLoading}>
              Register as Admin
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