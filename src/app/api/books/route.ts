import { CATEGORIES, CONDITIONS } from '@/lib/catalog'
import { storeBookPhoto } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') ?? '').toLowerCase()
  const category = searchParams.get('category') ?? ''

  const books = await prisma.book.findMany({
    include: { seller: true },
    orderBy: { createdAt: 'desc' },
  })

  const filtered = books.filter((book) => {
    const hay = `${book.title} ${book.author} ${book.category}`.toLowerCase()
    const matchesQuery = !q || hay.includes(q)
    const matchesCategory = !category || book.category === category
    return matchesQuery && matchesCategory
  })

  return NextResponse.json(filtered)
}

export async function POST(request: Request) {
  const form = await request.formData()
  const title = String(form.get('title') ?? '').trim()
  const author = String(form.get('author') ?? '').trim()
  const category = String(form.get('category') ?? '')
  const condition = String(form.get('condition') ?? '')
  const description = String(form.get('description') ?? '').trim()
  const price = Number(form.get('price'))
  const sellerName = String(form.get('sellerName') ?? '').trim()
  const email = String(form.get('email') ?? '').trim().toLowerCase()
  const city = String(form.get('city') ?? '').trim()
  const photo = form.get('photo')

  if (
    !title ||
    !author ||
    !description ||
    !sellerName ||
    !email ||
    !city ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !CATEGORIES.includes(category as (typeof CATEGORIES)[number]) ||
    !CONDITIONS.includes(condition as (typeof CONDITIONS)[number]) ||
    !(photo instanceof File) ||
    photo.size === 0
  ) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const imageUrl = await storeBookPhoto(photo)
  const seller = await prisma.seller.upsert({
    where: { email },
    update: { name: sellerName, city },
    create: { name: sellerName, email, city, bio: '' },
  })

  const book = await prisma.book.create({
    data: {
      title,
      author,
      category,
      condition,
      description,
      priceCents: Math.round(price * 100),
      imageUrl,
      sellerId: seller.id,
    },
  })

  return NextResponse.json(book)
}
