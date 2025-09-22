import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Validate file type
    const isValidType = 
      (type === 'audio' && file.type.startsWith('audio/')) ||
      (type === 'image' && file.type.startsWith('image/')) ||
      (type === 'video' && file.type.startsWith('video/'))

    if (!isValidType) {
      return NextResponse.json({ error: `Solo se permiten archivos de ${type}` }, { status: 400 })
    }

    // Validate file size
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: `El archivo es demasiado grande (máximo ${type === 'video' ? '100MB' : '50MB'})` }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', type)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}-${name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filepath = join(uploadsDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    // Return file info
    return NextResponse.json({
      id: filename,
      name: name,
      url: `/uploads/${type}/${filename}`,
      type: type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      duration: type === 'audio' ? 0 : undefined // TODO: Extract duration from audio/video files
    })

  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
