import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'

function getRedirectPath() {
  const params = new URLSearchParams(window.location.search)
  return params.get('redirect') || '/account'
}

function LoginPage({ navigate }) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(formData)
      navigate(getRedirectPath())
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>Login</h1>
        </div>

        {error && <p className="error-message compact">{error}</p>}

        <label>
          Username
          <input
            autoComplete="username"
            name="username"
            onChange={handleChange}
            required
            type="text"
            value={formData.username}
          />
        </label>

        <label>
          Password
          <input
            autoComplete="current-password"
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={formData.password}
          />
        </label>

        <button className="primary-action" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        <p className="auth-switch">
          New here?{' '}
          <a href="/signup" onClick={(event) => {
            event.preventDefault()
            navigate('/signup')
          }}>
            Create an account
          </a>
        </p>
      </form>
    </section>
  )
}

export default LoginPage
