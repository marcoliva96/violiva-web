import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Return empty data during build or if no database
    if (!process.env.DATABASE_URL) {
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

    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Import prisma only when needed
    const { prisma } = await import('@/lib/prisma')

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '6months'

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (range) {
      case '1month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        break
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
        break
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
    }

    // Get basic stats with error handling
    let totalBookings = 0
    let totalRevenue = 0
    let bookingsByMonth: any[] = []
    let popularPacks: any[] = []
    let popularSongs: any[] = []
    let clientGrowth: any[] = []

    try {
      const [bookings, revenue, monthlyData, packs, songs, growth] = await Promise.all([
        prisma.booking.count({
          where: { createdAt: { gte: startDate } }
        }),
        prisma.booking.aggregate({
          where: { createdAt: { gte: startDate } },
          _sum: { priceCents: true }
        }),
        prisma.booking.groupBy({
          by: ['createdAt'],
          where: { createdAt: { gte: startDate } },
          _count: { id: true },
          _sum: { priceCents: true }
        }),
        prisma.booking.groupBy({
          by: ['pack'],
          where: { createdAt: { gte: startDate } },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 5
        }),
        prisma.selection.groupBy({
          by: ['songId'],
          where: {
            songId: { not: null },
            booking: { createdAt: { gte: startDate } }
          },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 5
        }),
        prisma.client.groupBy({
          by: ['createdAt'],
          where: { createdAt: { gte: startDate } },
          _count: { id: true }
        })
      ])

      totalBookings = bookings
      totalRevenue = revenue._sum.priceCents || 0
      bookingsByMonth = monthlyData.map(item => ({
        month: item.createdAt.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        count: item._count.id,
        revenue: item._sum.priceCents || 0
      }))
      popularPacks = packs.map(pack => ({
        pack: pack.pack,
        count: pack._count.id
      }))
      popularSongs = await Promise.all(
        songs.map(async (song) => {
          const songData = await prisma.song.findUnique({
            where: { id: song.songId! },
            select: { title: true }
          })
          return {
            title: songData?.title || 'Unknown',
            count: song._count.id
          }
        })
      )
      clientGrowth = growth.map(item => ({
        month: item.createdAt.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        newClients: item._count.id
      }))
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      // Return empty data if database query fails
    }

    const analytics = {
      totalBookings,
      totalRevenue,
      averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
      bookingsByMonth,
      popularPacks,
      popularSongs,
      clientGrowth
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error in analytics API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}