import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Test prices endpoint called')
    
    // Precios actualizados
    const packPrices = {
      CEREMONIA: 30000,              // 300€
      APERITIVO_1H: 30000,           // 300€
      APERITIVO_1_5H: 37000,         // 370€
      CEREMONIA_APERITIVO_1H: 45000, // 450€
      CEREMONIA_APERITIVO_1_5H: 50000 // 500€
    }
    
    return NextResponse.json({ 
      message: 'Test prices endpoint working',
      prices: packPrices,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in test prices endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
