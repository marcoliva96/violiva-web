import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reviewSchema = z.object({
  member1: z.string().min(1, 'El nombre del miembro 1 es requerido'),
  member2: z.string().min(1, 'El nombre del miembro 2 es requerido'),
  rating: z.number().min(0).max(5, 'La puntuación debe ser entre 0 y 5'),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres'),
  weddingMonth: z.string().optional(),
  weddingYear: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = reviewSchema.parse(body)

    const review = await prisma.review.create({
      data: {
        clientName: `${validatedData.member1} y ${validatedData.member2}`,
        rating: validatedData.rating,
        comment: validatedData.comment,
        weddingDate: null, // No almacenamos fecha específica, solo mes
        isApproved: false,
        isFeatured: false
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Review enviada correctamente. Será revisada antes de publicarse.',
      review 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Datos inválidos', 
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Error creating review' }, { status: 500 })
  }
}
