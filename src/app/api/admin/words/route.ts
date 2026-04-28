export const dynamic = 'force-dynamic'

import { prisma } from '@/src/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const word = await prisma.word.create({
      data: {
        english_text: body.english_text,
        tamil_text: body.tamil_text,
        transliteration: body.transliteration,
        meaning_tamil: body.meaning_tamil,
        meaning_english: body.meaning_english,
        sg_context: body.sg_context || false,
        tags: JSON.stringify(body.tags || []),
        synonyms: JSON.stringify(body.synonyms || []),
        examples: JSON.stringify(body.examples || []),
      },
    })

    return NextResponse.json(word, { status: 201 })
  } catch (error) {
    console.error('Error creating word:', error)
    return NextResponse.json(
      { error: 'Failed to create word' },
      { status: 500 }
    )
  }
}
