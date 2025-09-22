import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!request.url) {
      return NextResponse.json(
        { error: 'URL no válida' },
        { status: 400 }
      )
    }
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'audio'

    const filepath = join(process.cwd(), 'public', 'uploads', type, id)

    try {
      await unlink(filepath)
    } catch (error) {
      console.error('Error deleting file:', error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
