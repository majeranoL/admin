import { useFirebase } from '../contexts/FirebaseContext'

export const useAuth = () => {
  const { currentUser, login, logout, signup, resetPassword, updateUserProfile, auth } = useFirebase()
  
  return {
    currentUser,
    login,
    logout,
    signup,
    resetPassword,
    updateUserProfile,
    auth,
    isAuthenticated: !!currentUser
  }
}
