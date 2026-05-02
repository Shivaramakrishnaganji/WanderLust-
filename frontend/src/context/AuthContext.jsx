import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext.js'
import { authApi } from '../services/api.js'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const refreshCurrentUser = useCallback(async () => {
    setIsAuthLoading(true)
    try {
      const data = await authApi.me()
      setCurrentUser(data.user)
    } catch {
      setCurrentUser(null)
    } finally {
      setIsAuthLoading(false)
    }
  }, [])

  const signup = useCallback(async (formData) => {
    const data = await authApi.signup(formData)
    setCurrentUser(data.user)
    return data.user
  }, [])

  const login = useCallback(async (formData) => {
    const data = await authApi.login(formData)
    setCurrentUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setCurrentUser(null)
  }, [])

  useEffect(() => {
    let isMounted = true

    authApi
      .me()
      .then((data) => {
        if (isMounted) {
          setCurrentUser(data.user)
        }
      })
      .catch(() => {
        if (isMounted) {
          setCurrentUser(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      isAuthLoading,
      login,
      logout,
      refreshCurrentUser,
      signup,
    }),
    [currentUser, isAuthLoading, login, logout, refreshCurrentUser, signup],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
