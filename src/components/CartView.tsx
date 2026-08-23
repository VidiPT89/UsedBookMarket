'use client'

import { formatEuro } from '@/lib/catalog'
import { useCart } from '@/lib/cart'
import { useLocale } from '@/i18n/LocaleProvider'
import { useState } from 'react'

export function CartView() {
  const { t } = useLocale()
  const { lines, remove, clear } = useCart()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const total = lines.reduce((sum, line) => sum + line.priceCents * line.quantity, 0)

  async function pay() {
    setBusy(true)
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, items: lines }),
    })
    const data = (await response.json()) as { url?: string }
    setBusy(false)
    if (data.url) {
      clear()
      window.location.href = data.url
    }
  }

  if (lines.length === 0) {
    return <p className="text-[#f4e6c8]/70">{t.emptyCart}</p>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="display text-5xl uppercase">{t.cart}</h1>
      <ul className="mt-8 grid gap-4">
        {lines.map((line) => (
          <li key={line.bookId} className="flex items-center justify-between border-b border-[#f4e6c8]/10 py-3">
            <div>
              <p className="display text-2xl uppercase">{line.title}</p>
              <p className="text-sm text-[#f4e6c8]/60">
                {line.quantity} × {formatEuro(line.priceCents)}
              </p>
            </div>
            <button type="button" className="text-xs uppercase text-[#ff7a00]" onClick={() => remove(line.bookId)}>
              {t.remove}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xl text-[#ffaa00]">
        {t.total}: {formatEuro(total)}
      </p>
      <input
        className="field mt-6"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={t.checkoutEmail}
      />
      <button className="btn mt-4" type="button" disabled={busy || !email} onClick={pay}>
        {t.checkout}
      </button>
    </div>
  )
}
