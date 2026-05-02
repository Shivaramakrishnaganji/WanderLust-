import { useAuth } from '../hooks/useAuth.js'

function AccountPage() {
  const { currentUser } = useAuth()

  return (
    <section className="account-page">
      <div className="account-card">
        <p className="eyebrow">Protected</p>
        <h1>{currentUser.username}</h1>
        <dl>
          <div>
            <dt>Email</dt>
            <dd>{currentUser.email}</dd>
          </div>
          <div>
            <dt>User ID</dt>
            <dd>{currentUser.id}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

export default AccountPage
