import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { safeDbOperation } from '@/lib/db-safe'

export async function GET(request: NextRequest) {
  try {
    // Return empty data during build
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

    // Get basic stats
    const [totalBookings, totalRevenue, bookingsByMonth, popularPacks, popularSongs, clientGrowth] = await Promise.all([
      // Total bookings
      prisma.booking.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),

      // Total revenue
      prisma.booking.aggregate({
        where: {
          createdAt: { gte: startDate }
        },
        _sum: {
          priceCents: true
        }
      }),

      // Bookings by month
      prisma.booking.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: startDate }
        },
        _count: {
          id: true
        },
        _sum: {
          priceCents: true
        }
      }),

      // Popular packs
      prisma.booking.groupBy({
        by: ['pack'],
        where: {
          createdAt: { gte: startDate }
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 5
      }),

      // Popular songs (from selections)
      prisma.selection.groupBy({
        by: ['songId'],
        where: {
          songId: { not: null },
          booking: {
            createdAt: { gte: startDate }
          }
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 5
      }),

      // Client growth
      prisma.client.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: startDate }
        },
        _count: {
          id: true
        }
      })
    ])

    // Process monthly data
    const monthlyData = bookingsByMonth.map(item => ({
      month: item.createdAt.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
      count: item._count.id,
      revenue: item._sum.priceCents || 0
    }))

    // Get song titles for popular songs
    const popularSongsWithTitles = await Promise.all(
      popularSongs.map(async (song) => {
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

    // Process client growth
    const clientGrowthData = clientGrowth.map(item => ({
      month: item.createdAt.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
      newClients: item._count.id
    }))

    const analytics = {
      totalBookings,
      totalRevenue: totalRevenue._sum.priceCents || 0,
      averageBookingValue: totalBookings > 0 ? (totalRevenue._sum.priceCents || 0) / totalBookings : 0,
      bookingsByMonth: monthlyData,
      popularPacks: popularPacks.map(pack => ({
        pack: pack.pack,
        count: pack._count.id
      })),
      popularSongs: popularSongsWithTitles,
      clientGrowth: clientGrowthData
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
