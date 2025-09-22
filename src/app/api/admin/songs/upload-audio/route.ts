import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('=== INICIO SUBIDA DE AUDIO ===')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const songId = formData.get('songId') as string

    console.log('Datos recibidos:', { 
      fileName: file?.name, 
      fileSize: file?.size, 
      fileType: file?.type, 
      songId 
    })

    if (!file || !songId) {
      console.log('Error: Archivo o songId faltante')
      return NextResponse.json({ error: 'Archivo y songId requeridos' }, { status: 400 })
    }

    // Verificar que es un archivo MP3
    if (!file.type.includes('audio/mpeg') && !file.name.toLowerCase().endsWith('.mp3')) {
      return NextResponse.json({ error: 'Solo se permiten archivos MP3' }, { status: 400 })
    }

    // Crear directorio si no existe
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'audio')
    await mkdir(uploadsDir, { recursive: true })

    // Generar nombre único para el archivo
    const fileName = `${songId}.mp3`
    const filePath = join(uploadsDir, fileName)

    // Convertir el archivo a buffer y guardarlo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('Guardando archivo en:', filePath)
    await writeFile(filePath, buffer)
    console.log('Archivo guardado exitosamente')

    // Calcular duración del archivo MP3
    const duration = await calculateMP3Duration(buffer)
    console.log('Duración calculada:', duration, 'segundos')

    // Actualizar la canción en la base de datos
    const updatedSong = await prisma.song.update({
      where: { id: songId },
      data: {
        durationSec: duration,
        s3Key: `/uploads/audio/${fileName}`
      }
    })
    console.log('Canción actualizada en BD:', updatedSong.id)

    console.log('=== SUBIDA COMPLETADA ===')
    return NextResponse.json({ 
      success: true, 
      url: `/uploads/audio/${fileName}`,
      duration: duration
    })

  } catch (error) {
    console.error('Error uploading audio:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// Función para calcular la duración de un archivo MP3
async function calculateMP3Duration(buffer: Buffer): Promise<number> {
  try {
    // Estimación simple basada en el tamaño del archivo
    // Asumiendo un bitrate promedio de 128kbps para MP3
    const bitrateKbps = 128
    const bitrateBps = bitrateKbps * 1000
    const durationSeconds = Math.floor((buffer.length * 8) / bitrateBps)
    
    // Asegurar que la duración sea razonable (entre 30 segundos y 10 minutos)
    const clampedDuration = Math.max(30, Math.min(durationSeconds, 600))
    
    console.log(`Duración estimada: ${clampedDuration} segundos (${Math.floor(clampedDuration/60)}:${clampedDuration%60})`)
    return clampedDuration

  } catch (error) {
    console.error('Error calculating MP3 duration:', error)
    // Fallback: duración por defecto
    return 180 // 3 minutos por defecto
  }
}
