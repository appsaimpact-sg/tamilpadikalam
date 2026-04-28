import { prisma } from '@/src/lib/prisma'
import WordsClient from '@/src/components/WordsClient'
import type { WordEntry } from '@/src/lib/types'

export default async function WordsPage() {
  const raw = await prisma.word.findMany({ orderBy: { english_text: 'asc' } })
  const words: WordEntry[] = raw.map(w => ({
    ...w,
    tags: JSON.parse(w.tags),
    synonyms: JSON.parse(w.synonyms),
    examples: JSON.parse(w.examples),
  }))
  return <WordsClient words={words} />
}
