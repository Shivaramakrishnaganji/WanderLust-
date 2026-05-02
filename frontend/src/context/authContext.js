import { createContext } from 'react'

export const AuthContext = createContext({
  currentUser: null,
  isAuthLoading: true,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  refreshCurrentUser: () => Promise.resolve(),
  signup: () => Promise.resolve(),
})
