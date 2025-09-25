import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Verify prices endpoint called')
    
    // Verificar que los precios están actualizados
    const expectedPrices = {
      CEREMONIA: '300€',
      APERITIVO_1H: '300€',
      APERITIVO_1_5H: '370€',
      CEREMONIA_APERITIVO_1H: '450€',
      CEREMONIA_APERITIVO_1_5H: '500€'
    }
    
    return NextResponse.json({ 
      message: 'Verify prices endpoint working',
      expectedPrices,
      timestamp: new Date().toISOString(),
      version: 'v2.0-2025-09-25T12:02:25Z'
    })
  } catch (error) {
    console.error('Error in verify prices endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
