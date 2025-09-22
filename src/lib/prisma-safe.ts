import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null = null

export function getPrisma(): PrismaClient | null {
  // Only create Prisma client if we have a valid database URL
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
    return null
  }

  if (!prisma) {
    try {
      prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
    } catch (error) {
      console.error('Failed to create Prisma client:', error)
      return null
    }
  }

  return prisma
}

export async function safePrismaOperation<T>(
  operation: (prisma: PrismaClient) => Promise<T>,
  fallback: T
): Promise<T> {
  const client = getPrisma()
  
  if (!client) {
    return fallback
  }

  try {
    return await operation(client)
  } catch (error) {
    console.error('Prisma operation failed:', error)
    return fallback
  }
}
