import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bookingSchema } from '@/lib/validations'
import { sendBookingNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    let validatedData
    try {
      validatedData = bookingSchema.parse(body)
    } catch (validationError) {
      console.error('Validation error:', validationError)
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: validationError },
        { status: 400 }
      )
    }
    
    const { client, weddingDate, ceremonyVenue, cocktailVenue, pack, ceremonyMoments = [], ceremonySongs = {}, cocktailStyles = [], cocktailComment = '', customSongs = [], firstPersonName = '', secondPersonName = '', languagePreference = 'castellano' } = validatedData

    // Calculate price based on pack
    const packPrices = {
      CEREMONIA: 30000,              // 300€
      APERITIVO_1H: 30000,           // 300€
      APERITIVO_1_5H: 37000,         // 370€
      CEREMONIA_APERITIVO_1H: 45000, // 450€
      CEREMONIA_APERITIVO_1_5H: 50000 // 500€
    }

    const priceCents = packPrices[pack]

    // Create client and booking in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create or find client
      const clientRecord = await tx.client.upsert({
        where: { email: client.email },
        update: {
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          partnerName: client.partnerName,
          weddingDate: weddingDate ? new Date(weddingDate) : null,
        },
        create: {
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          partnerName: client.partnerName,
          weddingDate: weddingDate ? new Date(weddingDate) : null,
        }
      })

      // Create booking
      const booking = await tx.booking.create({
        data: {
          clientId: clientRecord.id,
          date: weddingDate ? new Date(weddingDate) : new Date(),
          venue: ceremonyVenue || cocktailVenue, // Fallback para compatibilidad
          // ceremonyVenue, // Comentado hasta que exista en producción
          // cocktailVenue, // Comentado hasta que exista en producción
          pack: pack as any,
          priceCents,
          // languagePreference, // Comentado hasta que exista en producción
          source: 'web-form'
        }
      })

      // Create song selections
      const selections: Array<{
        bookingId: string
        songId?: string
        customTitle?: string
        customSource?: string
        orderIndex: number
        moment?: string
      }> = []
      let orderIndex = 0
      
      // Add ceremony songs
      Object.entries(ceremonySongs).forEach(([moment, songId]) => {
        if (songId && songId !== 'custom') {
          selections.push({
            bookingId: booking.id,
            songId: songId,
            orderIndex: orderIndex++,
            moment: moment
          })
        }
      })

      // Add custom songs
      customSongs.forEach((customSong) => {
        selections.push({
          bookingId: booking.id,
          customTitle: customSong.title,
          customSource: customSong.url,
          orderIndex: orderIndex++
        })
      })

      if (selections.length > 0) {
        await tx.selection.createMany({
          data: selections
        })
      }

      return { booking, client: clientRecord }
    })

    // Send notification email to admin
    try {
      await sendBookingNotification({
        client,
        pack,
        weddingDate: weddingDate || new Date().toISOString(),
        venue,
        ceremonyMoments,
        ceremonySongs,
        cocktailStyles,
        cocktailComment,
        customSongs,
        firstPersonName,
        secondPersonName
      })
    } catch (emailError) {
      console.error('Error sending notification email:', emailError)
      // Continue even if email fails
    }

    return NextResponse.json({
      bookingId: result.booking.id,
      clientId: result.client.id,
      priceCents: result.booking.priceCents,
      currency: result.booking.currency,
      state: result.booking.state,
      next: {
        message: 'Hemos recibido tu solicitud. Pronto recibirás un email con la propuesta.'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating booking:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
