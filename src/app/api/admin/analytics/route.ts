import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Always return empty data during build
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return NextResponse.json({
        totalBookings: 0,
        totalRevenue: 0,
        averageBookingValue: 0,
        bookingsByMonth: [],
        popularPacks: [],
        popularSongs: [],
        clientGrowth: []
      })
    }

    // Check if we have a valid database URL
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
      return NextResponse.json({
        totalBookings: 0,
        totalRevenue: 0,
        averageBookingValue: 0,
        bookingsByMonth: [],
        popularPacks: [],
        popularSongs: [],
        clientGrowth: []
      })
    }

    // Permitir acceso sin autenticación
    // TODO: Implementar autenticación real cuando sea necesario
    console.log('Accessing analytics API - NODE_ENV:', process.env.NODE_ENV)

    // Return mock data for now to avoid build issues
    return NextResponse.json({
      totalBookings: 0,
      totalRevenue: 0,
      averageBookingValue: 0,
      bookingsByMonth: [],
      popularPacks: [],
      popularSongs: [],
      clientGrowth: []
    })

  } catch (error) {
    console.error('Error in analytics API:', error)
    return NextResponse.json({
      totalBookings: 0,
      totalRevenue: 0,
      averageBookingValue: 0,
      bookingsByMonth: [],
      popularPacks: [],
      popularSongs: [],
      clientGrowth: []
    })
  }
}