import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const finalPriceUpdateSchema = z.object({
  finalPrice: z.number().positive()
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Permitir acceso sin autenticación
    // TODO: Implementar autenticación real cuando sea necesario
    console.log('Accessing booking final price update API - NODE_ENV:', process.env.NODE_ENV)

    const body = await request.json()
    const validatedData = finalPriceUpdateSchema.parse(body)

    const { id: bookingId } = await params
    
    // Actualizar el precio final del booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { finalPrice: validatedData.finalPrice },
      select: {
        id: true,
        priceCents: true,
        finalPrice: true,
        currency: true
      }
    })

    console.log('Booking final price updated:', updatedBooking)

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking final price:', error)
    
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
