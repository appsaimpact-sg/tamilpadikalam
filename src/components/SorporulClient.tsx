'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { SorporulEntry } from '@/src/lib/types'

export default function SorporulClient({ items }: { items: SorporulEntry[] }) {
  const [search, setSearch] = useState('')

  const filtered = items.filter(s => {
    const q = search.toLowerCase()
    if (!q) return true
    return (
      s.concept_english.toLowerCase().includes(q) ||
      s.concept_tamil.includes(q) ||
      s.concept_transliteration.toLowerCase().includes(q) ||
      s.synonyms.some(syn =>
        syn.word.includes(q) ||
        syn.transliteration.toLowerCase().includes(q) ||
        syn.meaning.toLowerCase().includes(q)
      )
    )
  })

  return (
    <>
      {/* Hero */}
      <div className="hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        <div>
          <h1 className="tamil-serif" style={{ fontSize: 26, fontWeight: 700, color: 'var(--accent2)', marginBottom: 4 }}>சொற்பொருள்</h1>
          <p style={{ color: 'var(--muted2)', fontSize: 14 }}>Synonyms with subtle differences explained clearly</p>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Stat n={items.length} l="Groups" />
          <Stat n={items.reduce((a, s) => a + s.synonyms.length, 0)} l="Synonyms" />
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted2)', pointerEvents: 'none' }}>⌕</span>
        <input
          type="text"
          placeholder="Search by concept or Tamil word..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="tamil"
          style={{
            width: '100%',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '11px 14px 11px 38px',
            fontSize: 14,
            background: 'white',
            color: 'var(--ink)',
            outline: 'none',
            fontFamily: "'Noto Sans Tamil', 'Lora', serif",
          }}
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <div className="tamil-serif" style={{ fontSize: 48, color: 'var(--border)', marginBottom: 12 }}>தேடல்</div>
          <p>No synonym groups found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filtered.map(s => (
            <Link key={s.id} href={`/sorporul/${s.id}`} style={{ textDecoration: 'none' }}>
              <div className="sorporul-card" style={{ cursor: 'pointer', transition: 'all 0.18s' }}>
                {/* Card header */}
                <div style={{ background: 'var(--gold2)', borderBottom: '1px solid var(--border)', padding: '16px 20px' }}>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                    {s.concept_english}
                  </div>
                  <div className="tamil-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
                    {s.concept_tamil}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted2)', fontStyle: 'italic', marginBottom: 8 }}>
                    {s.concept_transliteration}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6 }}>{s.description}</div>
                </div>

                {/* Synonyms preview */}
                <div style={{ padding: '14px 20px' }}>
                  {s.synonyms.slice(0, 3).map((syn, i) => (
                    <div key={i} className="synonym-row">
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '8px 12px 4px', background: 'var(--bg2)', flexWrap: 'wrap' }}>
                        <span className="tamil-serif" style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>{syn.word}</span>
                        <span style={{ fontSize: 11, color: 'var(--muted2)', fontStyle: 'italic' }}>{syn.transliteration}</span>
                      </div>
                      <div style={{ padding: '6px 12px 10px' }}>
                        <div style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500, marginBottom: 2 }}>{syn.meaning}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>{syn.nuance}</div>
                      </div>
                    </div>
                  ))}
                  {s.synonyms.length > 3 && (
                    <div className="mono" style={{ fontSize: 11, color: 'var(--gold)', textAlign: 'center', paddingTop: 6 }}>
                      +{s.synonyms.length - 3} more →
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

function Stat({ n, l }: { n: number; l: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 28, fontWeight: 600, color: 'white', fontFamily: "'Lora', serif" }}>{n}</div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
    </div>
  )
}
