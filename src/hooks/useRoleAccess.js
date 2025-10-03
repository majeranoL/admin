import { useRole } from './useRole'

// Hook for role-based conditional logic
export const useRoleAccess = () => {
  const { userRole, isAuthenticated, hasPermission } = useRole()

  return {
    isAdmin: userRole === 'admin',
    isSuperAdmin: userRole === 'superadmin',
    canAccess: (roles = [], permissions = []) => {
      if (!isAuthenticated) return false
      
      const hasRequiredRole = roles.length === 0 || roles.includes(userRole)
      const hasRequiredPermissions = permissions.length === 0 || 
        permissions.every(permission => hasPermission(permission))
      
      return hasRequiredRole && hasRequiredPermissions
    }
  }
}