import { NextRequest, NextResponse } from 'next/server'
import { sendBookingNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    // Datos de prueba
    const testBookingData = {
      client: {
        firstName: 'María',
        lastName: 'García',
        email: 'maria.garcia@example.com',
        phone: '+34 600 000 001',
        partnerName: 'Carlos López'
      },
      pack: 'CEREMONIA_APERITIVO_1H',
      weddingDate: '2024-06-15T16:00:00.000Z',
      venue: 'Masía El Olivar',
      ceremonyMoments: ['primera_entrada', 'segunda_entrada', 'salida'],
      ceremonySongs: {
        'primera_entrada': 'canon-in-d',
        'segunda_entrada': 'ave-maria',
        'salida': 'all-of-me'
      },
      cocktailStyles: ['clasica', 'jazz', 'pop'],
      cocktailComment: 'Música relajada para el cóctel',
      customSongs: [
        { title: 'Nuestra canción especial', url: 'https://example.com/song.mp3' }
      ],
      firstPersonName: 'María',
      secondPersonName: 'Carlos'
    }

    // Enviar email de prueba
    await sendBookingNotification(testBookingData)

    return NextResponse.json({
      success: true,
      message: 'Email de prueba enviado correctamente'
    })

  } catch (error) {
    console.error('Error enviando email de prueba:', error)
    return NextResponse.json({
      success: false,
      error: 'Error enviando email de prueba',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
