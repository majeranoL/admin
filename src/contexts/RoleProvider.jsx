import React, { useState, useEffect } from 'react'
import RoleContext from './RoleContext'



// Role Provider Component
export const RoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null)
  const [username, setUsername] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize role from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedRole = localStorage.getItem('userRole')
        const storedUsername = localStorage.getItem('adminUsername')
        const storedAuth = localStorage.getItem('isLoggedIn')

        if (storedRole && storedUsername && storedAuth === 'true') {
          setUserRole(storedRole)
          setUsername(storedUsername)
          setIsAuthenticated(true)
        } else {
          // Clear any partial auth data
          clearAuthData()
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Clear authentication data
  const clearAuthData = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('adminUsername')
    localStorage.removeItem('isLoggedIn')
    setUserRole(null)
    setUsername(null)
    setIsAuthenticated(false)
  }

  // Login function
  const login = (role, user) => {
    try {
      // Validate role
      if (!['admin', 'superadmin'].includes(role)) {
        throw new Error('Invalid role')
      }

      // Set state
      setUserRole(role)
      setUsername(user)
      setIsAuthenticated(true)

      // Persist to localStorage
      localStorage.setItem('userRole', role)
      localStorage.setItem('adminUsername', user)
      localStorage.setItem('isLoggedIn', 'true')

      console.log(`User logged in: ${user} with role: ${role}`)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Logout function
  const logout = () => {
    clearAuthData()
    // Reload page to redirect to login
    window.location.reload()
  }

  // Update role (for role switching if needed)
  const updateRole = (newRole) => {
    if (!['admin', 'superadmin'].includes(newRole)) {
      throw new Error('Invalid role')
    }
    
    setUserRole(newRole)
    localStorage.setItem('userRole', newRole)
    console.log(`Role updated to: ${newRole}`)
  }

  // Permission checker
  const hasPermission = (permission) => {
    if (!isAuthenticated || !userRole) return false

    // Define role permissions
    const rolePermissions = {
      admin: [
        'view_dashboard',
        'manage_rescue_reports',
        'manage_volunteers',
        'manage_rescued_animals',
        'manage_adoption_requests',
        'view_notifications',
        'manage_settings'
      ],
      superadmin: [
        'view_dashboard',
        'manage_admins',
        'manage_shelters',
        'view_system_reports',
        'view_audit_logs',
        'manage_system_settings',
        // SuperAdmin inherits all admin permissions
        'manage_rescue_reports',
        'manage_volunteers',
        'manage_rescued_animals',
        'manage_adoption_requests',
        'view_notifications',
        'manage_settings'
      ]
    }

    return rolePermissions[userRole]?.includes(permission) || false
  }

  // Context value
  const value = {
    userRole,
    username,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateRole,
    hasPermission
  }

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  )
}

export default RoleContext