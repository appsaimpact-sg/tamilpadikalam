import { prisma } from '@/src/lib/prisma'
import type { WordEntry } from '@/src/lib/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function WordDetail({ params }: { params: { id: string } }) {
  const raw = await prisma.word.findUnique({ where: { id: params.id } })
  if (!raw) notFound()

  const w: WordEntry = {
    ...raw,
    tags: JSON.parse(raw.tags),
    synonyms: JSON.parse(raw.synonyms),
    examples: JSON.parse(raw.examples),
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <Link href="/words" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)', textDecoration: 'none', marginBottom: 20 }}>
        ← Back to all words
      </Link>

      {/* Header */}
      <div style={{ background: 'var(--ink)', borderRadius: 'var(--radius)', padding: '28px 32px', marginBottom: 24 }}>
        {w.sg_context && <div className="sg-badge" style={{ marginBottom: 12 }}>🇸🇬 Singapore word</div>}
        <div className="mono" style={{ fontSize: 11, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          {w.english_text}
        </div>
        <div className="tamil-serif" style={{ fontSize: 40, fontWeight: 700, color: 'var(--accent2)', lineHeight: 1.2, marginBottom: 4 }}>
          {w.tamil_text}
        </div>
        <div style={{ fontSize: 15, color: 'var(--muted2)', fontStyle: 'italic' }}>
          {w.transliteration}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Meaning */}
        <section>
          <div className="section-label">Meaning</div>
          <div className="meaning-box">
            <div className="tamil" style={{ fontSize: 16, color: 'var(--teal)', marginBottom: 8, lineHeight: 1.7 }}>
              {w.meaning_tamil}
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink2)' }}>{w.meaning_english}</div>
          </div>
          {w.sg_context && (
            <div style={{ background: 'var(--sg-bg)', border: '1px solid var(--sg-border)', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10, fontSize: 13, color: 'var(--ink2)' }}>
              <span style={{ color: 'var(--accent)', fontSize: 16, flexShrink: 0 }}>🇸🇬</span>
              <span>This is a Singapore-specific word. Knowing it helps with PSLE composition writing set in Singapore contexts.</span>
            </div>
          )}
        </section>

        {/* Examples */}
        <section>
          <div className="section-label">Example sentences</div>
          {w.examples.map((ex, i) => (
            <div key={i} className="example-item">
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span className={`dot dot-${ex.difficulty}`} style={{ marginTop: 6 }} />
                <div className="tamil" style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.7 }}>{ex.tamil}</div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', paddingLeft: 13 }}>{ex.english}</div>
            </div>
          ))}
        </section>

        {/* Tags */}
        <section>
          <div className="section-label">Topics</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {w.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
          </div>
        </section>
      </div>
    </div>
  )
}
