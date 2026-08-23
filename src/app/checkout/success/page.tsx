'use client'

import { useLocale } from '@/i18n/LocaleProvider'
import Link from 'next/link'

export default function SuccessPage() {
  const { t } = useLocale()
  return (
    <div className="mx-auto max-w-lg text-center">
      <h1 className="display text-5xl uppercase">{t.paid}</h1>
      <p className="mt-4 text-[#f4e6c8]/75">{t.paidLead}</p>
      <Link href="/" className="btn mt-8 inline-flex">
        {t.backHome}
      </Link>
    </div>
  )
}
