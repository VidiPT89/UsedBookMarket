import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) {
    return NextResponse.json({ ok: true })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'signature' }, { status: 400 })
  }

  const payload = await request.text()
  const event = stripe.webhooks.constructEvent(payload, signature, secret)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderId = session.metadata?.orderId
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'paid', stripeSessionId: session.id },
      })
    }
  }

  return NextResponse.json({ received: true })
}
