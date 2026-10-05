'use client'

import { CATEGORIES, CONDITIONS } from '@/lib/catalog'
import { useLocale } from '@/i18n/LocaleProvider'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SellForm() {
  const { t } = useLocale()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/books', { method: 'POST', body: form })
    setBusy(false)
    if (!response.ok) {
      setError('Could not publish this listing.')
      return
    }
    const book = (await response.json()) as { id: string }
    router.push(`/books/${book.id}`)
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-xl gap-4">
      <h1 className="display text-5xl uppercase">{t.sell}</h1>
      <input className="field" name="title" required placeholder={t.listTitle} />
      <input className="field" name="author" required placeholder={t.listAuthor} />
      <label className="grid gap-1 text-sm">
        <span className="text-[#f4e6c8]/70">{t.listCategory}</span>
      <select className="field" name="category" defaultValue="fiction">
        {CATEGORIES.map((item) => (
          <option key={item} value={item}>
            {t.categories[item]}
          </option>
        ))}
      </select>
      </label>
      <label className="grid gap-1 text-sm">
        <span className="text-[#f4e6c8]/70">{t.listCondition}</span>
      <select className="field" name="condition" defaultValue="good">
        {CONDITIONS.map((item) => (
          <option key={item} value={item}>
            {t.conditions[item]}
          </option>
        ))}
      </select>
      </label>
      <input className="field" name="price" type="number" min="1" step="0.01" required placeholder={t.listPrice} />
      <textarea className="field min-h-28" name="description" required placeholder={t.listDesc} />
      <label className="grid gap-1 text-sm">
        <span className="text-[#f4e6c8]/70">{t.listPhoto}</span>
        <input className="field" name="photo" type="file" accept="image/*" required />
      </label>
      <input className="field" name="sellerName" required placeholder={t.listSeller} />
      <input className="field" name="email" type="email" required placeholder={t.listEmail} />
      <input className="field" name="city" required placeholder={t.listCity} />
      {error ? <p className="text-sm text-[#ff7a00]">{error}</p> : null}
      <button className="btn" type="submit" disabled={busy}>
        {t.listSubmit}
      </button>
    </form>
  )
}
