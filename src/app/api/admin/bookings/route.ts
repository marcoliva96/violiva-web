import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Permitir acceso sin autenticación en desarrollo y producción
    // TODO: Implementar autenticación real cuando sea necesario
    console.log('Accessing bookings API - NODE_ENV:', process.env.NODE_ENV)

    if (!request.url) {
      return NextResponse.json(
        { error: 'URL no válida' },
        { status: 400 }
      )
    }
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const page = parseInt(searchParams.get('page') || '1')
    const size = parseInt(searchParams.get('size') || '10')

    const where: Record<string, unknown> = {}

    if (state) {
      where.state = state
    }

    if (from && to) {
      where.date = {
        gte: new Date(from),
        lte: new Date(to),
      }
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            }
          },
          selections: {
            include: {
              song: {
                select: {
                  title: true,
                  composer: true,
                }
              }
            }
          },
          contract: {
            select: {
              id: true,
              generatedAt: true,
              sentAt: true,
              signedAt: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.booking.count({ where })
    ])

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        size,
        total,
        pages: Math.ceil(total / size)
      }
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
