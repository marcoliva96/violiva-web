import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { bookingUpdateSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Permitir acceso sin autenticación
    // TODO: Implementar autenticación real cuando sea necesario
    console.log('Accessing API - NODE_ENV:', process.env.NODE_ENV)

    const { id } = await params
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        client: true,
        selections: {
          include: {
            song: true
          },
          orderBy: { orderIndex: 'asc' }
        },
        contract: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // En desarrollo, permitir acceso sin autenticación
    if (process.env.NODE_ENV === 'production') {
      // Permitir acceso sin autenticación
    // TODO: Implementar autenticación real cuando sea necesario
    console.log('Accessing API - NODE_ENV:', process.env.NODE_ENV)
    }

    const body = await request.json()
    const validatedData = bookingUpdateSchema.parse(body)

    const { id: updateId } = await params
    const booking = await prisma.booking.update({
      where: { id: updateId },
      data: validatedData,
      include: {
        client: true,
        selections: {
          include: {
            song: true
          }
        },
        contract: true
      }
    })

    // Log admin action (solo si hay sesión)
    if (process.env.NODE_ENV === 'production') {
      const session = await getServerSession(authOptions)
      if (session?.user?.id) {
        await prisma.action.create({
          data: {
            userId: session.user.id,
            type: 'BOOKING_UPDATE',
            payload: {
              bookingId: updateId,
              changes: validatedData
            }
          }
        })
      }
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error updating booking:', error)
    
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
