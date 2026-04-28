import { PrismaClient } from '@prisma/client'
import words from '../data/words.json'
import sorporul from '../data/sorporul.json'

const prisma = new PrismaClient()

async function main() {
  await prisma.word.deleteMany()
  await prisma.sorporul.deleteMany()

  for (const w of words as any[]) {
    await prisma.word.create({
      data: {
        english_text: w.english_text,
        tamil_text: w.tamil_text,
        transliteration: w.transliteration,
        meaning_tamil: w.meaning_tamil,
        meaning_english: w.meaning_english,
        sg_context: w.sg_context,
        tags: JSON.stringify(w.tags),
        synonyms: JSON.stringify(w.synonyms || []),
        examples: JSON.stringify(w.examples),
      }
    })
  }

  for (const s of sorporul as any[]) {
    await prisma.sorporul.create({
      data: {
        concept_english: s.concept_english,
        concept_tamil: s.concept_tamil,
        concept_transliteration: s.concept_transliteration,
        description: s.description,
        synonyms: JSON.stringify(s.synonyms),
      }
    })
  }

  console.log(`✅ Seeded ${words.length} words and ${sorporul.length} sorporul groups`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
