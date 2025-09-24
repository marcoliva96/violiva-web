import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing clients endpoint...')
    
    // Contar todos los clientes
    const totalClients = await prisma.client.count()
    console.log('Total clients in database:', totalClients)
    
    // Obtener algunos clientes
    const clients = await prisma.client.findMany({
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('Sample clients:', clients)
    
    return NextResponse.json({
      totalClients,
      sampleClients: clients,
      message: 'Test completed successfully'
    })
  } catch (error) {
    console.error('Error testing clients:', error)
    return NextResponse.json(
      { error: 'Error testing clients', details: error },
      { status: 500 }
    )
  }
}
