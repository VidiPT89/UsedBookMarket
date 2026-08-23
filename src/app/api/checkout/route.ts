import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

type Item = { bookId: string; title: string; priceCents: number; quantity: number }

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; items?: Item[] }
  const email = body.email?.trim().toLowerCase() ?? ''
  const items = body.items ?? []
  if (!email || items.length === 0) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const totalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const stripe = getStripe()

  const order = await prisma.order.create({
    data: {
      email,
      totalCents,
      status: stripe ? 'pending' : 'paid',
      items: {
        create: items.map((item) => ({
          bookId: item.bookId,
          title: item.title,
          priceCents: item.priceCents,
          quantity: item.quantity,
        })),
      },
    },
  })

  if (!stripe) {
    return NextResponse.json({ url: `${origin}/checkout/success?order=${order.id}` })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    metadata: { orderId: order.id },
    line_items: items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'eur',
        unit_amount: item.priceCents,
        product_data: { name: item.title },
      },
    })),
  })

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  })

  return NextResponse.json({ url: session.url })
}
