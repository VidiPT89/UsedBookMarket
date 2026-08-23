import { v2 as cloudinary } from 'cloudinary'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

function configured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  )
}

export async function storeBookPhoto(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer())
  if (configured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    const data = `data:${file.type};base64,${bytes.toString('base64')}`
    const result = await cloudinary.uploader.upload(data, {
      folder: 'used-book-market',
    })
    return result.secure_url
  }

  const name = `${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`
  const dir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, name), bytes)
  return `/uploads/${name}`
}
