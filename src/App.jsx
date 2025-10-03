import { useState, useEffect } from "react"
import Dashboard from "./Dashboard"
import "./css/App.css"

function App() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginMessage, setLoginMessage] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUsername, setLoggedInUsername] = useState("")
  const [userRole, setUserRole] = useState("admin") // Default to admin

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

  const handleSubmit = (e) => {
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
        setLoginMessage("Login successful! Welcome to Animal911 Admin.")
        setLoggedInUsername(username)
        setUserRole(userRole)
        
        // Store login info and show dashboard after delay
        localStorage.setItem('adminUsername', username)
        localStorage.setItem('userRole', userRole)
        localStorage.setItem('isLoggedIn', 'true')
        
        setTimeout(() => {
          setIsLoggedIn(true)
        }, 1500)
        
        console.log("Login successful:", { username, password, userRole })
      } else {
        setLoginMessage("Invalid username or password. Try: admin/admin123 or superadmin/super123")
      }
    } else {
      setLoginMessage("Please enter both username and password.")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setLoggedInUsername("")
    setUsername("")
    setPassword("")
    setLoginMessage("")
    setUserRole("admin")
    localStorage.removeItem('adminUsername')
    localStorage.removeItem('userRole')
    localStorage.removeItem('isLoggedIn')
  }

  useEffect(() => {
    // Set body class for login page
    document.body.className = 'login-page';
    
    // Check if already logged in
    const savedUsername = localStorage.getItem('adminUsername')
    const savedRole = localStorage.getItem('userRole')
    const savedLoginStatus = localStorage.getItem('isLoggedIn')
    
    if (savedLoginStatus === 'true' && savedUsername) {
      setIsLoggedIn(true)
      setLoggedInUsername(savedUsername)
      setUserRole(savedRole || 'admin')
    }

    // Add Font Awesome CSS if not already present
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);

  // If logged in, show dashboard
  if (isLoggedIn) {
    // Set body class for dashboard
    document.body.className = 'dashboard-page';
    return <Dashboard username={loggedInUsername} onLogout={handleLogout} userRole={userRole} />
  }

  // Otherwise show login form
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
             {showPassword ? "hindi nakikita" : "nakikita"}
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

export default App