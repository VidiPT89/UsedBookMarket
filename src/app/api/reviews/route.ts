import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = (await request.json()) as {
    sellerId?: string
    authorName?: string
    rating?: number
    comment?: string
  }

  const rating = Number(body.rating)
  if (
    !body.sellerId ||
    !body.authorName?.trim() ||
    !body.comment?.trim() ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const review = await prisma.review.create({
    data: {
      sellerId: body.sellerId,
      authorName: body.authorName.trim(),
      rating,
      comment: body.comment.trim(),
    },
  })

  return NextResponse.json(review)
}
