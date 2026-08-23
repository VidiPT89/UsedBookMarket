import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const covers = {
  saramago:
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
  poetry:
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  comics:
    'https://images.unsplash.com/photo-1618519764620-7401607768d7?auto=format&fit=crop&w=800&q=80',
  kids: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  academic:
    'https://images.unsplash.com/photo-14565130808-0b3ff7d94d78?auto=format&fit=crop&w=800&q=80',
  essay:
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
}

async function main() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.book.deleteMany()
  await prisma.seller.deleteMany()

  const ines = await prisma.seller.create({
    data: {
      name: 'Inês Carvalho',
      email: 'ines@usedbook.market',
      city: 'Lisboa',
      bio: 'Caixas de mudanças, primeiras edições e notas a lápis nas margens.',
    },
  })

  const rui = await prisma.seller.create({
    data: {
      name: 'Rui Mendes',
      email: 'rui@usedbook.market',
      city: 'Porto',
      bio: 'Banda desenhada, ensaio e o que sobra da estante depois de cada mudança.',
    },
  })

  await prisma.book.createMany({
    data: [
      {
        title: 'Memorial do Convento',
        author: 'José Saramago',
        category: 'fiction',
        condition: 'very-good',
        description: 'Capa intacta, uma dedicatória de 1998 na guarda.',
        priceCents: 1200,
        imageUrl: covers.saramago,
        sellerId: ines.id,
      },
      {
        title: 'O Ano da Morte de Ricardo Reis',
        author: 'José Saramago',
        category: 'fiction',
        condition: 'good',
        description: 'Lombada um pouco clara do sol. Texto limpo.',
        priceCents: 900,
        imageUrl: covers.essay,
        sellerId: ines.id,
      },
      {
        title: 'Livro do Desassossego',
        author: 'Fernando Pessoa',
        category: 'poetry',
        condition: 'like-new',
        description: 'Edição Relógio d’Água, quase sem uso.',
        priceCents: 1500,
        imageUrl: covers.poetry,
        sellerId: ines.id,
      },
      {
        title: 'Asterix e Cleópatra',
        author: 'Goscinny / Uderzo',
        category: 'comics',
        condition: 'good',
        description: 'Cantos usados, cores ainda vivas.',
        priceCents: 700,
        imageUrl: covers.comics,
        sellerId: rui.id,
      },
      {
        title: 'A História Interminável',
        author: 'Michael Ende',
        category: 'children',
        condition: 'fair',
        description: 'Capa plastificada de biblioteca escolar. História completa.',
        priceCents: 600,
        imageUrl: covers.kids,
        sellerId: rui.id,
      },
      {
        title: 'Introdução à Economia',
        author: 'Paul Samuelson',
        category: 'academic',
        condition: 'good',
        description: 'Sublinhados a lápis nos primeiros capítulos.',
        priceCents: 1800,
        imageUrl: covers.academic,
        sellerId: rui.id,
      },
    ],
  })

  await prisma.review.createMany({
    data: [
      {
        sellerId: ines.id,
        authorName: 'Marta L.',
        rating: 5,
        comment: 'Embalagem cuidada e o livro chegou mais cedo do que o previsto.',
      },
      {
        sellerId: ines.id,
        authorName: 'Tiago P.',
        rating: 4,
        comment: 'Descrição honesta. Um canto um pouco mais gasto do que a foto.',
      },
      {
        sellerId: rui.id,
        authorName: 'Sofia N.',
        rating: 5,
        comment: 'BD em óptimo estado. Voltarei a comprar.',
      },
    ],
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
