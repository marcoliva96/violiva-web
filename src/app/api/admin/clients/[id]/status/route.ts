import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const clientStatusUpdateSchema = z.object({
  status: z.enum(['CONTACTED', 'NEGOTIATING', 'CONFIRMED', 'PAID', 'REALIZED', 'CANCELLED'])
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Permitir acceso sin autenticación
    // TODO: Implementar autenticación real cuando sea necesario
    console.log('Accessing client status update API - NODE_ENV:', process.env.NODE_ENV)

    const body = await request.json()
    const validatedData = clientStatusUpdateSchema.parse(body)

    const { id: bookingId } = await params
    
    // Buscar el booking para obtener el clientId
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { clientId: true }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar el estado del cliente
    const updatedClient = await prisma.client.update({
      where: { id: booking.clientId },
      data: { status: validatedData.status },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true
      }
    })

    console.log('Client status updated:', updatedClient)

    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error('Error updating client status:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: error },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
