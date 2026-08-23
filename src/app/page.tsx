import { BookGrid } from '@/components/BookGrid'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const books = await prisma.book.findMany({
    include: { seller: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <BookGrid
      books={books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        condition: book.condition,
        priceCents: book.priceCents,
        imageUrl: book.imageUrl,
        sellerName: book.seller.name,
        sellerId: book.sellerId,
      }))}
    />
  )
}
