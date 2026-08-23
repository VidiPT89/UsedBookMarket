'use client'

import { CATEGORIES, formatEuro } from '@/lib/catalog'
import { useLocale } from '@/i18n/LocaleProvider'
import { matchesQuery } from '@/lib/catalog'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export type BookCard = {
  id: string
  title: string
  author: string
  category: string
  condition: string
  priceCents: number
  imageUrl: string
  sellerName: string
  sellerId: string
}

export function BookGrid({ books }: { books: BookCard[] }) {
  const { t } = useLocale()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  const filtered = useMemo(
    () =>
      books.filter(
        (book) =>
          matchesQuery(book, query) && (category === '' || book.category === category),
      ),
    [books, query, category],
  )

  return (
    <div>
      <section className="mb-10 grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#ff7a00]">{t.tagline}</p>
          <h1 className="display mt-2 text-5xl uppercase leading-none md:text-7xl">{t.hero}</h1>
          <p className="mt-4 max-w-xl text-[#f4e6c8]/80">{t.heroLead}</p>
        </div>
        <div className="grid gap-3">
          <input
            className="field"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
          />
          <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">{t.allCategories}</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {t.categories[item]}
              </option>
            ))}
          </select>
        </div>
      </section>

      {filtered.length === 0 ? (
        <p className="text-[#f4e6c8]/60">{t.emptyShelf}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((book, index) => (
            <motion.article
              key={book.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="overflow-hidden rounded-xl border border-[#f4e6c8]/12 bg-black/35"
            >
              <Link href={`/books/${book.id}`}>
                <div className="relative aspect-[3/4]">
                  <Image src={book.imageUrl} alt={book.title} fill className="object-cover" sizes="400px" />
                </div>
                <div className="p-4">
                  <h2 className="display text-2xl uppercase">{book.title}</h2>
                  <p className="text-sm text-[#f4e6c8]/70">{book.author}</p>
                  <p className="mt-3 text-[#ffaa00]">{formatEuro(book.priceCents)}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  )
}
