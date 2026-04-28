export const dynamic = 'force-dynamic'

import { prisma } from '@/src/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const words = await prisma.word.findMany({
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json(words)
  } catch (error) {
    console.error('Error fetching words:', error)
    return NextResponse.json(
      { error: 'Failed to fetch words' },
      { status: 500 }
    )
  }
}
