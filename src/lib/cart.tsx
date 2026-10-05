'use client'

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'

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

// The cart lives in localStorage and is read through useSyncExternalStore: no setState in an
// effect, an empty cart on the server, and other tabs stay in sync through the storage event.
const EMPTY: CartLine[] = []
const listeners = new Set<() => void>()
let cachedRaw: string | null = null
let cachedLines: CartLine[] = EMPTY

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

function readLines(): CartLine[] {
  const raw = localStorage.getItem(STORAGE)
  if (raw !== cachedRaw) {
    cachedRaw = raw
    try {
      cachedLines = raw ? (JSON.parse(raw) as CartLine[]) : EMPTY
    } catch {
      cachedLines = EMPTY
    }
  }
  return cachedLines
}

function setLines(update: CartLine[] | ((prev: CartLine[]) => CartLine[])) {
  const next = typeof update === 'function' ? update(readLines()) : update
  localStorage.setItem(STORAGE, JSON.stringify(next))
  listeners.forEach((notify) => notify())
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, readLines, () => EMPTY)

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
