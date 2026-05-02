import { useCallback, useEffect, useState } from 'react'
import { AuthProvider } from './context/AuthContext.jsx'
import AppShell from './components/AppShell.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AccountPage from './pages/AccountPage.jsx'
import EditListingPage from './pages/EditListingPage.jsx'
import ListingsIndexPage from './pages/ListingsIndexPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NewListingPage from './pages/NewListingPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import './App.css'

function getCurrentPath() {
  return window.location.pathname
}

function App() {
  const [path, setPath] = useState(getCurrentPath)

  useEffect(() => {
    const handleLocationChange = () => setPath(getCurrentPath())

    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  const navigate = useCallback((nextPath) => {
    window.history.pushState({}, '', nextPath)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  const renderPage = () => {
    const editListingMatch = path.match(/^\/listings\/([^/]+)\/edit$/)
    const listingDetailMatch = path.match(/^\/listings\/([^/]+)$/)

    if (path === '/signup') {
      return <SignupPage navigate={navigate} />
    }

    if (path === '/login') {
      return <LoginPage navigate={navigate} />
    }

    if (path === '/account') {
      return (
        <ProtectedRoute navigate={navigate}>
          <AccountPage />
        </ProtectedRoute>
      )
    }

    if (path === '/listings/new') {
      return (
        <ProtectedRoute navigate={navigate}>
          <NewListingPage navigate={navigate} />
        </ProtectedRoute>
      )
    }

    if (editListingMatch) {
      return (
        <ProtectedRoute navigate={navigate}>
          <EditListingPage listingId={editListingMatch[1]} navigate={navigate} />
        </ProtectedRoute>
      )
    }

    if (listingDetailMatch) {
      return <ListingsIndexPage initialListingId={listingDetailMatch[1]} navigate={navigate} />
    }

    return <ListingsIndexPage navigate={navigate} />
  }

  return (
    <AuthProvider>
      <AppShell navigate={navigate}>{renderPage()}</AppShell>
    </AuthProvider>
  )
}

export default App
