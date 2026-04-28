import { prisma } from '@/src/lib/prisma'
import type { SorporulEntry } from '@/src/lib/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function SorporulDetail({ params }: { params: { id: string } }) {
  const raw = await prisma.sorporul.findUnique({ where: { id: params.id } })
  if (!raw) notFound()

  const s: SorporulEntry = { ...raw, synonyms: JSON.parse(raw.synonyms) }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <Link href="/sorporul" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)', textDecoration: 'none', marginBottom: 20 }}>
        ← Back to synonyms
      </Link>

      {/* Header */}
      <div style={{ background: 'var(--ink)', borderRadius: 'var(--radius)', padding: '28px 32px', marginBottom: 24 }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          {s.concept_english}
        </div>
        <div className="tamil-serif" style={{ fontSize: 40, fontWeight: 700, color: 'var(--accent2)', lineHeight: 1.2, marginBottom: 4 }}>
          {s.concept_tamil}
        </div>
        <div style={{ fontSize: 15, color: 'var(--muted2)', fontStyle: 'italic', marginBottom: 12 }}>
          {s.concept_transliteration}
        </div>
        <div style={{ fontSize: 14, color: 'var(--muted2)', lineHeight: 1.7 }}>{s.description}</div>
      </div>

      {/* Synonyms */}
      <div className="section-label">Synonyms — {s.synonyms.length} words</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {s.synonyms.map((syn, i) => (
          <div key={i} className="synonym-row" style={{ border: '1px solid var(--border2)', borderRadius: 12, overflow: 'hidden' }}>
            {/* Word header */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '12px 18px 8px', background: 'var(--bg2)', flexWrap: 'wrap' }}>
              <span className="tamil-serif" style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)' }}>{syn.word}</span>
              <span style={{ fontSize: 13, color: 'var(--muted2)', fontStyle: 'italic' }}>{syn.transliteration}</span>
            </div>

            {/* Details */}
            <div style={{ padding: '12px 18px 16px' }}>
              <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500, marginBottom: 4 }}>{syn.meaning}</div>
              <div style={{
                fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 12,
                padding: '6px 10px', background: 'var(--gold2)', borderRadius: 6, display: 'inline-block'
              }}>
                💡 {syn.nuance}
              </div>

              <div className="section-label" style={{ marginBottom: 8 }}>Example</div>
              <div className="example-item">
                <div className="tamil" style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.7 }}>{syn.example_tamil}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', marginTop: 4 }}>{syn.example_english}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
