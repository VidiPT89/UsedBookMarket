export const CATEGORIES = [
  'fiction',
  'nonfiction',
  'poetry',
  'comics',
  'academic',
  'children',
  'other',
] as const

export type Category = (typeof CATEGORIES)[number]

export const CONDITIONS = ['like-new', 'very-good', 'good', 'fair'] as const

export type Condition = (typeof CONDITIONS)[number]

export type BookRecord = {
  title: string
  author: string
  category: string
}

export function matchesQuery(book: BookRecord, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    book.title.toLowerCase().includes(q) ||
    book.author.toLowerCase().includes(q) ||
    book.category.toLowerCase().includes(q)
  )
}

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(
    cents / 100,
  )
}
