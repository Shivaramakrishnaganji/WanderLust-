import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'

function SignupPage({ navigate }) {
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
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
      await signup(formData)
      navigate('/account')
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
          <p className="eyebrow">Join Wanderlust</p>
          <h1>Signup</h1>
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
          Email
          <input
            autoComplete="email"
            name="email"
            onChange={handleChange}
            required
            type="email"
            value={formData.email}
          />
        </label>

        <label>
          Password
          <input
            autoComplete="new-password"
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={formData.password}
          />
        </label>

        <button className="primary-action" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>

        <p className="auth-switch">
          Already have an account?{' '}
          <a href="/login" onClick={(event) => {
            event.preventDefault()
            navigate('/login')
          }}>
            Login
          </a>
        </p>
      </form>
    </section>
  )
}

export default SignupPage
