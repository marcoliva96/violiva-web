import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Parámetros from y to son requeridos' },
        { status: 400 }
      )
    }

    const fromDate = new Date(from)
    const toDate = new Date(to)

    // Get bookings in the date range
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: fromDate,
          lte: toDate,
        },
        state: {
          in: ['CONFIRMED', 'PAID', 'COMPLETED']
        }
      },
      select: {
        date: true,
        venue: true,
        pack: true,
        state: true,
      }
    })

    // Format response to show only busy dates with minimal info
    const busyDates = bookings.map((booking: any) => ({
      date: (booking.date as Date).toISOString().split('T')[0],
      venue: booking.venue,
      pack: booking.pack,
      state: booking.state,
    }))

    return NextResponse.json(busyDates)
  } catch (error) {
    console.error('Error fetching calendar:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
