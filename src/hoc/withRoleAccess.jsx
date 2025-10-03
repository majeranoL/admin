// HOC for role-based component access
import React from 'react'
import { useRole } from '../hooks/useRole'

export const withRoleAccess = (WrappedComponent, requiredRole = null, requiredPermission = null) => {
  const RoleProtectedComponent = (props) => {
    const { userRole, isAuthenticated, hasPermission, isLoading } = useRole()

    // Show loading state
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      )
    }

    // Check authentication
    if (!isAuthenticated) {
      return (
        <div className="access-denied">
          <h3>🔒 Authentication Required</h3>
          <p>Please log in to access this content.</p>
        </div>
      )
    }

    // Check role requirement
    if (requiredRole && userRole !== requiredRole) {
      return (
        <div className="access-denied">
          <h3>❌ Access Denied</h3>
          <p>You don't have the required role ({requiredRole}) to access this content.</p>
          <p>Your current role: {userRole}</p>
        </div>
      )
    }

    // Check permission requirement
    if (requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="access-denied">
          <h3>❌ Insufficient Permissions</h3>
          <p>You don't have the required permission ({requiredPermission}) to access this content.</p>
        </div>
      )
    }

    // All checks passed, render the component
    return <WrappedComponent {...props} />
  }

  // Set display name for debugging
  RoleProtectedComponent.displayName = `withRoleAccess(${WrappedComponent.displayName || WrappedComponent.name})`

  return RoleProtectedComponent
}

export default withRoleAccess