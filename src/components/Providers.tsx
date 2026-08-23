'use client'

import { CartProvider } from '@/lib/cart'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <CartProvider>{children}</CartProvider>
    </LocaleProvider>
  )
}
