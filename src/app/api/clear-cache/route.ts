import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Clear cache endpoint called')
    
    // Agregar headers para forzar la actualización del cache
    const response = NextResponse.json({ 
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString(),
      version: 'v2.0-2025-09-25T12:03:20Z',
      instructions: [
        '1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)',
        '2. Wait 2-3 minutes for Vercel cache to update',
        '3. Try incognito mode to avoid browser cache',
        '4. Check /api/debug-translations to verify translations'
      ]
    })
    
    // Headers para forzar la actualización del cache
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Last-Modified', new Date().toUTCString())
    
    return response
  } catch (error) {
    console.error('Error in clear cache endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
