import Link from 'next/link'
import { prisma } from '@/src/lib/prisma'

export default async function Home() {
  const wordCount = await prisma.word.count()
  const sgCount = await prisma.word.count({ where: { sg_context: true } })
  const sorporulCount = await prisma.sorporul.count()

  const features = [
    {
      href: '/words',
      tamilTitle: 'சொல் பொருள்',
      englishTitle: 'Tamil Words',
      desc: 'English words with Tamil meanings — including Singapore-specific terms like MRT, void deck and hawker centre.',
      count: wordCount,
      countLabel: 'words',
      color: 'var(--teal)',
      available: true,
    },
    {
      href: '/sorporul',
      tamilTitle: 'சொற்பொருள்',
      englishTitle: 'Synonyms',
      desc: 'Similar Tamil words explained — understand exactly when to use மகிழ்ச்சி vs ஆனந்தம் vs சந்தோஷம்.',
      count: sorporulCount,
      countLabel: 'groups',
      color: 'var(--gold)',
      available: true,
    },
    {
      href: '#',
      tamilTitle: 'திருக்குறள்',
      englishTitle: 'Thirukkural',
      desc: 'Kurals grouped by concept — friendship, courage, kindness, education — with Tamil and English meaning.',
      count: null,
      countLabel: 'coming soon',
      color: 'var(--accent)',
      available: false,
    },
    {
      href: '#',
      tamilTitle: 'பழமொழி',
      englishTitle: 'Palamozhi',
      desc: 'Tamil proverbs with English equivalents and example sentences to use in your composition.',
      count: null,
      countLabel: 'coming soon',
      color: 'var(--muted)',
      available: false,
    },
  ]

  return (
    <>
      {/* Hero */}
      <div className="hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', background: '#87CEEB', padding: '32px 24px', borderRadius: 'var(--radius)', marginBottom: 32 }}>
        <div>
          <h1 className="tamil-serif" style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
            தமிழ் படிக்கலாம்
          </h1>
          <p style={{ color: '#FFFFFF', fontSize: 15, maxWidth: 420 }}>
            Tamil vocabulary for Singapore P6 students preparing for PSLE. Words, synonyms, Thirukkural and proverbs — all in one place.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { n: wordCount, l: 'Words' },
            { n: sgCount, l: 'Singapore' },
            { n: sorporulCount, l: 'Synonym groups' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 600, color: 'white', fontFamily: "'Lora', serif" }}>{s.n}</div>
              <div className="mono" style={{ fontSize: 10, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {features.map(f => (
          <Link
            key={f.href + f.englishTitle}
            href={f.href}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: 'white',
              border: '1px solid var(--border2)',
              borderRadius: 'var(--radius)',
              padding: '24px',
              height: '100%',
              borderTop: `4px solid ${f.color}`,
              opacity: f.available ? 1 : 0.6,
              transition: 'all 0.18s',
              cursor: f.available ? 'pointer' : 'default',
            }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                {f.englishTitle}
              </div>
              <div className="tamil-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 10 }}>
                {f.tamilTitle}
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 14 }}>
                {f.desc}
              </p>
              <div className="mono" style={{ fontSize: 11, color: f.available ? f.color : 'var(--muted)', fontWeight: 500 }}>
                {f.count !== null ? `${f.count} ${f.countLabel}` : f.countLabel} {f.available ? '→' : ''}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
