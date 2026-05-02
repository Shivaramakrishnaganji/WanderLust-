import { useAuth } from '../hooks/useAuth.js'

function AppShell({ children, navigate }) {
  const { currentUser, isAuthLoading, logout } = useAuth()

  const handleNavigate = (event, path) => {
    event.preventDefault()
    navigate(path)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" onClick={(event) => handleNavigate(event, '/')}>
          Wanderlust
        </a>
        <nav className="topnav">
          <a href="/" onClick={(event) => handleNavigate(event, '/')}>
            Listings
          </a>
          <a href="/account" onClick={(event) => handleNavigate(event, '/account')}>
            Account
          </a>
          {currentUser ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <a href="/login" onClick={(event) => handleNavigate(event, '/login')}>
                Login
              </a>
              <a href="/signup" onClick={(event) => handleNavigate(event, '/signup')}>
                Signup
              </a>
            </>
          )}
          <div className="session-pill">
            {isAuthLoading ? 'Checking session' : currentUser?.username || 'Guest'}
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default AppShell
