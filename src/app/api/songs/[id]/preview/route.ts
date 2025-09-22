import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCloudFrontSignedUrl } from '@/lib/aws'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: songId } = await params

    const song = await prisma.song.findUnique({
      where: { id: songId },
      select: { s3Key: true }
    })

    if (!song) {
      return NextResponse.json(
        { error: 'Canción no encontrada' },
        { status: 404 }
      )
    }

    // If song has an uploaded file, use it directly
    if (song.s3Key && song.s3Key.startsWith('/uploads/')) {
      return NextResponse.json({
        signedUrl: song.s3Key,
        expiresIn: 3600 // 1 hour for uploaded files
      })
    }

    // Generate HLS manifest path for sample files
    const hlsManifestPath = `/hls/${song.s3Key.replace('.mp3', '.m3u8')}`
    
    // Generate signed URL valid for 5 minutes
    const signedUrl = generateCloudFrontSignedUrl(hlsManifestPath, 300)

    return NextResponse.json({
      signedUrl,
      expiresIn: 300
    })
  } catch (error) {
    console.error('Error generating preview URL:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
