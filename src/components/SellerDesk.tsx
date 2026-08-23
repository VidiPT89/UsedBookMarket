'use client'

import { formatEuro } from '@/lib/catalog'
import { useLocale } from '@/i18n/LocaleProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Seller = {
  id: string
  name: string
  city: string
  bio: string
  books: { id: string; title: string; priceCents: number }[]
  reviews: { id: string; authorName: string; rating: number; comment: string }[]
}

export function SellerDesk({ seller }: { seller: Seller }) {
  const { t } = useLocale()
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setBusy(true)
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sellerId: seller.id,
        authorName: data.get('authorName'),
        rating: Number(data.get('rating')),
        comment: data.get('comment'),
      }),
    })
    setBusy(false)
    form.reset()
    router.refresh()
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
      <section>
        <p className="text-xs uppercase tracking-[0.2em] text-[#ff7a00]">{t.seller}</p>
        <h1 className="display mt-2 text-5xl uppercase">{seller.name}</h1>
        <p className="mt-2 text-[#f4e6c8]/70">{seller.city}</p>
        <p className="mt-4 max-w-prose">{seller.bio}</p>
        <ul className="mt-8 grid gap-3">
          {seller.books.map((book) => (
            <li key={book.id}>
              <Link href={`/books/${book.id}`} className="hover:text-[#ff7a00]">
                {book.title} · {formatEuro(book.priceCents)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="display text-3xl uppercase">{t.reviews}</h2>
        <ul className="mt-4 grid gap-4">
          {seller.reviews.map((review) => (
            <li key={review.id} className="border-b border-[#f4e6c8]/10 pb-3">
              <p className="text-[#ffaa00]">{'★'.repeat(review.rating)}</p>
              <p className="text-sm text-[#f4e6c8]/70">{review.authorName}</p>
              <p className="mt-1">{review.comment}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={onSubmit} className="mt-8 grid gap-3">
          <h3 className="display text-2xl uppercase">{t.leaveReview}</h3>
          <input className="field" name="authorName" required placeholder={t.yourName} />
          <select className="field" name="rating" defaultValue="5">
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
          <textarea className="field min-h-24" name="comment" required placeholder={t.comment} />
          <button className="btn" type="submit" disabled={busy}>
            {t.send}
          </button>
        </form>
      </section>
    </div>
  )
}
