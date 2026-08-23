import { BookDetail } from '@/components/BookDetail'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = await prisma.book.findUnique({
    where: { id },
    include: { seller: { include: { reviews: true } } },
  })
  if (!book) notFound()

  const rating =
    book.seller.reviews.length === 0
      ? 0
      : book.seller.reviews.reduce((sum, review) => sum + review.rating, 0) /
        book.seller.reviews.length

  return (
    <BookDetail
      book={{
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        condition: book.condition,
        description: book.description,
        priceCents: book.priceCents,
        imageUrl: book.imageUrl,
        sellerId: book.sellerId,
        sellerName: book.seller.name,
        sellerCity: book.seller.city,
        sellerRating: rating,
        reviewCount: book.seller.reviews.length,
      }}
    />
  )
}
