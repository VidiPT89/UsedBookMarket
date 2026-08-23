'use client'

import { formatEuro } from '@/lib/catalog'
import { useCart } from '@/lib/cart'
import { useLocale } from '@/i18n/LocaleProvider'
import type { Category, Condition } from '@/lib/catalog'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  book: {
    id: string
    title: string
    author: string
    category: string
    condition: string
    description: string
    priceCents: number
    imageUrl: string
    sellerId: string
    sellerName: string
    sellerCity: string
    sellerRating: number
    reviewCount: number
  }
}

export function BookDetail({ book }: Props) {
  const { t } = useLocale()
  const { add } = useCart()
  const category = book.category as Category
  const condition = book.condition as Condition

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#f4e6c8]/12">
        <Image src={book.imageUrl} alt={book.title} fill className="object-cover" sizes="600px" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#ff7a00]">
          {t.categories[category] ?? book.category} · {t.conditions[condition] ?? book.condition}
        </p>
        <h1 className="display mt-2 text-5xl uppercase">{book.title}</h1>
        <p className="mt-2 text-lg text-[#f4e6c8]/75">{book.author}</p>
        <p className="mt-6 text-3xl text-[#ffaa00]">{formatEuro(book.priceCents)}</p>
        <p className="mt-4 max-w-prose text-[#f4e6c8]/80">{book.description}</p>
        <Link href={`/sellers/${book.sellerId}`} className="mt-6 block text-sm text-[#ff7a00]">
          {t.seller}: {book.sellerName} · {book.sellerCity}
          {book.reviewCount > 0
            ? ` · ${book.sellerRating.toFixed(1)}/5 (${book.reviewCount})`
            : ''}
        </Link>
        <button
          type="button"
          className="btn mt-8"
          onClick={() =>
            add({
              bookId: book.id,
              title: book.title,
              priceCents: book.priceCents,
              imageUrl: book.imageUrl,
            })
          }
        >
          {t.addCart}
        </button>
      </div>
    </article>
  )
}
