import { prisma } from '@/src/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    
    const sorporul = await prisma.sorporul.update({
      where: { id: params.id },
      data: {
        concept_english: body.concept_english,
        concept_tamil: body.concept_tamil,
        concept_transliteration: body.concept_transliteration,
        description: body.description,
        synonyms: JSON.stringify(body.synonyms || []),
      },
    })

    return NextResponse.json(sorporul)
  } catch (error) {
    console.error('Error updating sorporul:', error)
    return NextResponse.json(
      { error: 'Failed to update sorporul' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sorporul = await prisma.sorporul.delete({
      where: { id: params.id },
    })

    return NextResponse.json(sorporul)
  } catch (error) {
    console.error('Error deleting sorporul:', error)
    return NextResponse.json(
      { error: 'Failed to delete sorporul' },
      { status: 500 }
    )
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sorporul = await prisma.sorporul.findUnique({
      where: { id: params.id },
    })

    if (!sorporul) {
      return NextResponse.json(
        { error: 'Sorporul not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(sorporul)
  } catch (error) {
    console.error('Error fetching sorporul:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sorporul' },
      { status: 500 }
    )
  }
}
