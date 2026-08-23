# 📚 Used Book Market

> A bilingual second-hand book marketplace with photo listings, search, a cart and Stripe test checkout, painted in the ividi.dev palette (black, burnt orange, amber).

[🐞 Report Bug](https://github.com/VidiPT89/UsedBookMarket/issues) · [✨ Request Feature](https://github.com/VidiPT89/UsedBookMarket/issues)

Used Book Market is a Next.js stall for volumes that already have a previous reader. List a book with a photograph, filter the shelf by title, author or category, review a seller, and pay through Stripe in test mode. Cloudinary holds the covers when configured; otherwise photos stay on disk. The UI is European Portuguese / English, with the language toggle remembered in `localStorage`.

## ✨ Main Features

- 📷 **List a book with a photo** — title, author, category, condition, price and cover
- 🔎 **Search** — title, author or category, plus a category filter
- 🛒 **Cart and checkout** — Stripe Checkout in test mode, or a local stand-in when no secret key is set
- ⭐ **Seller reviews** — rating and comment on the seller desk
- 🌍 **PT / EN toggle** — remembered in `localStorage`
- 🎬 **Motion** — ember glow and staggered shelf cards

## 🛠️ Technologies

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=nextdotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat&logo=prisma&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-test-635BFF?style=flat&logo=stripe&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-optional-3448C5?style=flat&logo=cloudinary&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat&logo=tailwindcss&logoColor=white)

| Category | Technology | Purpose |
|----------|-----------|---------|
| **App** | Next.js App Router | Pages, forms and API routes |
| **Data** | Prisma + SQLite | Sellers, books, reviews and orders |
| **Payments** | Stripe Checkout (test) | Card flow with test keys |
| **Media** | Cloudinary | Optional cover uploads |
| **Motion** | Framer Motion | Hero and card reveal |

## 🧱 Project Structure

```text
UsedBookMarket/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   ├── components/
│   ├── i18n/
│   └── lib/
├── tests/
├── LICENSE
└── README.md
```

## ▶️ How to Run

### Prerequisites

- **Node.js** 18+

### Installation

```bash
git clone https://github.com/VidiPT89/UsedBookMarket.git
cd UsedBookMarket
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Cloudinary and Stripe are optional. Leave those keys empty to store photos under `public/uploads` and to complete checkout without a Stripe session. For a real test payment, create a Stripe test secret key and use card `4242 4242 4242 4242`.

## 📖 Usage

1. Toggle **PT** or **EN** in the header.
2. Browse the seeded shelf or search by title, author or category.
3. Open a volume, add it to the cart, and pay with a receipt email.
4. Publish a new listing from **Sell a book**.
5. Leave a review on the seller page.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books?q=&category=` | Search the shelf |
| POST | `/api/books` | Create a listing (`multipart/form-data`) |
| POST | `/api/reviews` | Add a seller review |
| POST | `/api/checkout` | Start Stripe Checkout or a local paid order |
| POST | `/api/webhooks/stripe` | Mark an order paid |

## 🧪 Testing

```bash
npm test
```

`node:test` checks title, author and category matching.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more information.

---

Developed by **David Arsénio Martins**  
🌐 [ividi.dev](https://ividi.dev/) · 💻 [github.com/VidiPT89](https://github.com/VidiPT89/)
