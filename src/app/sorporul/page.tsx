import { prisma } from '@/src/lib/prisma'
import SorporulClient from '@/src/components/SorporulClient'
import type { SorporulEntry } from '@/src/lib/types'

export default async function SorporulPage() {
  const raw = await prisma.sorporul.findMany({ orderBy: { concept_english: 'asc' } })
  const items: SorporulEntry[] = raw.map(s => ({
    ...s,
    synonyms: JSON.parse(s.synonyms),
  }))
  return <SorporulClient items={items} />
}
