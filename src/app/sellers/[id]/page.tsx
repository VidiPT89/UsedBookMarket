import { SellerDesk } from '@/components/SellerDesk'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const seller = await prisma.seller.findUnique({
    where: { id },
    include: {
      books: { orderBy: { createdAt: 'desc' } },
      reviews: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!seller) notFound()

  return (
    <SellerDesk
      seller={{
        id: seller.id,
        name: seller.name,
        city: seller.city,
        bio: seller.bio,
        books: seller.books.map((book) => ({
          id: book.id,
          title: book.title,
          priceCents: book.priceCents,
        })),
        reviews: seller.reviews.map((review) => ({
          id: review.id,
          authorName: review.authorName,
          rating: review.rating,
          comment: review.comment,
        })),
      }}
    />
  )
}
