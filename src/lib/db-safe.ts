import { prisma } from './prisma'

export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    // Check if we're in build mode or no database connection
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
      return fallback
    }
    
    return await operation()
  } catch (error) {
    console.error('Database operation failed:', error)
    return fallback
  }
}

export function isDbAvailable(): boolean {
  return !!(process.env.DATABASE_URL && process.env.NODE_ENV !== 'production')
}
