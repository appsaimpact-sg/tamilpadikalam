import { prisma } from '@/src/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const sorporul = await prisma.sorporul.create({
      data: {
        concept_english: body.concept_english,
        concept_tamil: body.concept_tamil,
        concept_transliteration: body.concept_transliteration,
        description: body.description,
        synonyms: JSON.stringify(body.synonyms || []),
      },
    })

    return NextResponse.json(sorporul, { status: 201 })
  } catch (error) {
    console.error('Error creating sorporul:', error)
    return NextResponse.json(
      { error: 'Failed to create sorporul' },
      { status: 500 }
    )
  }
}
