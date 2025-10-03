// Utility functions for role-based access control

export const checkRoleAccess = (userRole, requiredRoles = []) => {
  if (requiredRoles.length === 0) return true
  return requiredRoles.includes(userRole)
}

export const checkPermissionAccess = (permissions, hasPermissionFn, requiredPermissions = []) => {
  if (requiredPermissions.length === 0) return true
  return requiredPermissions.every(permission => hasPermissionFn(permission))
}

export const validateRole = (role) => {
  return ['admin', 'superadmin'].includes(role)
}

export const getRoleDisplayName = (role) => {
  const roleNames = {
    admin: 'Admin',
    superadmin: 'Super Admin'
  }
  return roleNames[role] || 'Unknown'
}