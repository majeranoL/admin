import { createContext } from 'react'

// Create the Role Context
const RoleContext = createContext({
  userRole: null,
  username: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  updateRole: () => {},
  hasPermission: () => false,
  isLoading: true
})

export default RoleContext