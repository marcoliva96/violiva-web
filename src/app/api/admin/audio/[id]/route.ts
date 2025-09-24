import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Permitir acceso sin autenticación
    // TODO: Implementar autenticación real cuando sea necesario
    console.log('Accessing API - NODE_ENV:', process.env.NODE_ENV)

    const { id } = params
    const filepath = join(process.cwd(), 'public', 'uploads', 'audio', id)

    try {
      await unlink(filepath)
    } catch (error) {
      console.error('Error deleting file:', error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting audio:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
