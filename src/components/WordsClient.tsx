'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { WordEntry } from '@/src/lib/types'

export default function WordsClient({ words }: { words: WordEntry[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'sg', label: '🇸🇬 Singapore' },
    { key: 'values', label: 'Values' },
    { key: 'psle-core', label: 'PSLE Core' },
  ]

  const filtered = words.filter(w => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      w.english_text.toLowerCase().includes(q) ||
      w.tamil_text.includes(q) ||
      w.transliteration.toLowerCase().includes(q) ||
      w.meaning_english.toLowerCase().includes(q) ||
      w.meaning_tamil.includes(q)

    const matchFilter =
      filter === 'all' ? true :
      filter === 'sg' ? w.sg_context :
      w.tags.includes(filter)

    return matchSearch && matchFilter
  })

  return (
    <>
      {/* Hero */}
      <div className="hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        <div>
          <h1 className="tamil-serif" style={{ fontSize: 26, fontWeight: 700, color: 'var(--accent2)', marginBottom: 4 }}>சொல் பொருள்</h1>
          <p style={{ color: 'var(--muted2)', fontSize: 14 }}>Tamil meanings · Singapore context · PSLE vocabulary</p>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Stat n={words.length} l="Words" />
          <Stat n={words.filter(w => w.sg_context).length} l="Singapore" />
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted2)', pointerEvents: 'none' }}>⌕</span>
        <input
          type="text"
          placeholder="Search in Tamil or English... / தமிழில் தேடுங்கள்"
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

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>Filter</span>
        {filters.map(f => (
          <button
            key={f.key}
            className={`filter-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
        {filtered.length !== words.length && (
          <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 'auto' }}>
            {filtered.length} of {words.length}
          </span>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <div className="tamil-serif" style={{ fontSize: 48, color: 'var(--border)', marginBottom: 12 }}>தேடல்</div>
          <p style={{ fontSize: 15 }}>No words found. Try a different search.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {filtered.map(w => (
            <Link key={w.id} href={`/words/${w.id}`} style={{ textDecoration: 'none' }}>
              <div className={`word-card ${w.sg_context ? 'sg' : ''}`}>
                {w.sg_context && <div className="sg-badge" style={{ marginBottom: 10 }}>🇸🇬 Singapore</div>}
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
                  {w.english_text}
                </div>
                <div className="tamil-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
                  {w.tamil_text}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted2)', fontStyle: 'italic', marginBottom: 10 }}>
                  {w.transliteration}
                </div>
                <div style={{
                  fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6,
                  borderTop: '1px solid var(--border2)', paddingTop: 10,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {w.meaning_english}
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
                  {w.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
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
