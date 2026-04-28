'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Login failed')
      }

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--bg)',
    }}>
      <div style={{
        background: 'white',
        border: '1px solid var(--border2)',
        borderRadius: 'var(--radius)',
        padding: 32,
        maxWidth: 320,
        width: '100%',
      }}>
        <h1 className="tamil-serif" style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--ink)',
          marginBottom: 8,
          textAlign: 'center',
        }}>
          Admin Login
        </h1>
        <p style={{
          color: 'var(--muted2)',
          fontSize: 13,
          textAlign: 'center',
          marginBottom: 24,
        }}>
          Enter admin password to continue
        </p>

        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius)',
            marginBottom: 16,
            background: 'rgba(200, 90, 30, 0.1)',
            color: 'var(--accent)',
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid var(--border2)',
                borderRadius: 'var(--radius)',
                fontFamily: 'inherit',
                fontSize: 14,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 'var(--radius)',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
