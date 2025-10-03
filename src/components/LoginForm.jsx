import { useState } from "react"
import { useRole } from "../hooks/useRole"

function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginMessage, setLoginMessage] = useState("")
  const { login } = useRole()

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
      let loginSuccess = false
      let userRole = "admin"
      
      // Check if credentials match any dummy account
      Object.values(dummyCredentials).forEach(account => {
        if (username.toLowerCase() === account.username && password === account.password) {
          loginSuccess = true
          userRole = account.role
        }
      })
      
      if (loginSuccess) {
        try {
          setLoginMessage("Login successful! Welcome to Animal911 Admin.")
          
          // Use the context login function
          await login(userRole, username)
          
          console.log("Login successful:", { username, userRole })
        } catch (error) {
          console.error("Login error:", error)
          setLoginMessage("Login failed. Please try again.")
        }
      } else {
        setLoginMessage("Invalid username or password. Try: admin/admin123 or superadmin/super123")
      }
    } else {
      setLoginMessage("Please enter both username and password.")
    }
  }

  return (
    <div className="app">
      <div className="login-container" style={{ position: 'relative' }}>
        <div className="login-form">
          <div className="logo">
            <h1>Animal911</h1>
            <p>Admin Login</p>
          </div>

          <form onSubmit={handleSubmit}>
            {loginMessage && (
              <div className={`login-message ${username.trim() && password.trim() ? 'success' : 'error'}`}>
                {loginMessage}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
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

            <button type="submit" className="login-btn">
              Login
            </button>
            <button type="button" className="register-btn">
              Register as Admin
            </button>

            <div className="forgot-password">
              <a href="#forgot">Forgot Password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm