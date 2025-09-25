import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Force cache update endpoint called')
    
    // Agregar headers para forzar la actualización del cache
    const response = NextResponse.json({ 
      message: 'Cache update forced',
      timestamp: new Date().toISOString(),
      version: 'v2.0-2025-09-25T12:03:20Z'
    })
    
    // Headers para forzar la actualización del cache
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error in force cache update endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
