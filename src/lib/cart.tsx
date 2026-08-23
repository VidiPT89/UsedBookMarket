'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type CartLine = {
  bookId: string
  title: string
  priceCents: number
  quantity: number
  imageUrl: string
}

const STORAGE = 'used-book-market-cart'

type Ctx = {
  lines: CartLine[]
  count: number
  add: (line: Omit<CartLine, 'quantity'>) => void
  remove: (bookId: string) => void
  clear: () => void
}

const CartContext = createContext<Ctx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE)
    if (!raw) return
    try {
      setLines(JSON.parse(raw) as CartLine[])
    } catch {
      setLines([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(lines))
  }, [lines])

  const value = useMemo<Ctx>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      add: (line) => {
        setLines((prev) => {
          const found = prev.find((item) => item.bookId === line.bookId)
          if (found) {
            return prev.map((item) =>
              item.bookId === line.bookId ? { ...item, quantity: item.quantity + 1 } : item,
            )
          }
          return [...prev, { ...line, quantity: 1 }]
        })
      },
      remove: (bookId) => setLines((prev) => prev.filter((item) => item.bookId !== bookId)),
      clear: () => setLines([]),
    }),
    [lines],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): Ctx {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('CartProvider missing')
  return ctx
}
