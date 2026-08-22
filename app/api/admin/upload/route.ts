import { auth } from '@/lib/auth'
import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

// Vercel Functions limit server-upload request bodies to 4.5 MB.
const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4 MB
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || !(session.user as { isAdmin?: boolean }).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Please choose an image file' }, { status: 400 })
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Use a JPG, PNG, WebP, or GIF image' }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image must be 5 MB or smaller' }, { status: 400 })
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const pathname = `menu/${crypto.randomUUID()}.${extension}`
    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Menu image upload error:', error)
    return NextResponse.json({ error: 'Unable to upload image' }, { status: 500 })
  }
}
