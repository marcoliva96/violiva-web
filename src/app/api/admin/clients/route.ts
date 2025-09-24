import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // En desarrollo, permitir acceso sin autenticación
    if (process.env.NODE_ENV === 'production') {
      const session = await getServerSession(authOptions)
      
      if (!session?.user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }
    }

    if (!request.url) {
      return NextResponse.json(
        { error: 'URL no válida' },
        { status: 400 }
      )
    }
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    console.log('Fetching clients with where clause:', where)
    
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          partnerName: true,
          weddingDate: true,
          createdAt: true,
          bookings: {
            select: {
              id: true,
              date: true,
              venue: true,
              ceremonyVenue: true,
              cocktailVenue: true,
              pack: true,
              priceCents: true,
              state: true,
              languagePreference: true,
              createdAt: true,
              selections: {
                select: {
                  id: true,
                  moment: true,
                  customTitle: true,
                  customSource: true,
                  song: {
                    select: {
                      id: true,
                      title: true,
                      composer: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.client.count({ where })
    ])

    console.log('Found clients:', clients.length, 'Total:', total)

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
