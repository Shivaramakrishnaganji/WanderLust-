import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'

function ProtectedRoute({ children, navigate }) {
  const { currentUser, isAuthLoading } = useAuth()

  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      const redirectTo = `${window.location.pathname}${window.location.search}`
      navigate(`/login?redirect=${encodeURIComponent(redirectTo)}`)
    }
  }, [currentUser, isAuthLoading, navigate])

  if (isAuthLoading) {
    return <p className="auth-status">Checking session...</p>
  }

  if (!currentUser) {
    return null
  }

  return children
}

export default ProtectedRoute
