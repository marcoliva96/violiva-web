import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Test actions endpoint called')
    return NextResponse.json({ 
      message: 'Test actions endpoint working',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in test actions endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Test actions POST called with body:', body)
    
    return NextResponse.json({ 
      message: 'Test actions POST working',
      received: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in test actions POST:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
