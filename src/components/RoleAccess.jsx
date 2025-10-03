import React from 'react'
import { useRole } from '../hooks/useRole'

// Component for conditional role-based rendering
export const RoleBasedRender = ({ 
  roles = [], 
  permissions = [], 
  fallback = null, 
  children 
}) => {
  const { userRole, isAuthenticated, hasPermission } = useRole()

  if (!isAuthenticated) {
    return fallback
  }

  // Check if user has required role
  const hasRequiredRole = roles.length === 0 || roles.includes(userRole)
  
  // Check if user has required permissions
  const hasRequiredPermissions = permissions.length === 0 || 
    permissions.every(permission => hasPermission(permission))

  if (hasRequiredRole && hasRequiredPermissions) {
    return children
  }

  return fallback
}

export default RoleBasedRender