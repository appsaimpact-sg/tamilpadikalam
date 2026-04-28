import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'தமிழ் படிக்கலாம் — PSLE Tamil',
  description: 'Learn Tamil for PSLE — words, synonyms, Thirukkural and more',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta">
      <body>
        <header style={{
          background: 'var(--header-bg)',
          borderBottom: '3px solid var(--header-border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
          }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ lineHeight: 1.2 }}>
                <div className="tamil-serif" style={{ fontSize: 20, fontWeight: 600, color: 'var(--header-text)' }}>
                  தமிழ் படிக்கலாம்
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--header-text)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  தமிழ் படிக்கலாம்
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--header-text)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  PSLE Tamil · Singapore
                </div>
              </div>
            </Link>

            <nav style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
              <NavLink href="/words">Words</NavLink>
              <NavLink href="/sorporul">சொற்பொருள்</NavLink>
            </nav>
          </div>
        </header>

        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
          {children}
        </main>

        <footer style={{
          borderTop: '1px solid var(--border2)',
          padding: '20px 24px',
          textAlign: 'center',
          color: 'var(--muted)',
          fontSize: 13,
        }}>
          <span className="tamil-serif" style={{ color: 'var(--accent2)', marginRight: 8 }}>தமிழ் படிக்கலாம்</span>
          Made for Singapore PSLE Tamil students
        </footer>
      </body>
    </html>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 7,
      color: 'var(--header-text)',
      fontSize: 13,
      padding: '7px 14px',
      textDecoration: 'none',
      fontFamily: "'Lora', serif",
      transition: 'all 0.15s',
    }}>
      {children}
    </Link>
  )
}
