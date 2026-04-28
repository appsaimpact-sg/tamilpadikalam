import { prisma } from '@/src/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sorporul = await prisma.sorporul.findMany({
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json(sorporul)
  } catch (error) {
    console.error('Error fetching sorporul:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sorporul' },
      { status: 500 }
    )
  }
}
