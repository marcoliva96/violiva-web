import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    if (!request.url) {
      return NextResponse.json(
        { error: 'URL no válida' },
        { status: 400 }
      )
    }
    const { searchParams } = new URL(request.url)
    const genre = searchParams.get('genre')
    const q = searchParams.get('q')
    const featured = searchParams.get('featured') === 'true'

    const where: Record<string, unknown> = {}

    if (genre) {
      where.genre = genre
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { composer: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (featured) {
      where.isFeatured = true
    }

    const songs = await prisma.song.findMany({
      where,
      select: {
        id: true,
        title: true,
        composer: true,
        genre: true,
        durationSec: true,
        isFeatured: true,
        s3Key: true,
        createdAt: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { title: 'asc' }
      ]
    })

    // Add audio URLs - use uploaded files if available, otherwise fallback to samples
    const songsWithAudio = songs.map((song, index) => ({
      ...song,
      hlsManifestUrl: `/uploads/audio/${song.id}.mp3` // This will be the uploaded file
    }))

    return NextResponse.json(songsWithAudio)
  } catch (error) {
    console.error('Error fetching songs:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
