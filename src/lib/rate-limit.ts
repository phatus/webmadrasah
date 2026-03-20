import prisma from '@/lib/db'

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 10 // maximum 10 requests per window

/**
 * Check if request is allowed based on rate limit
 * @param identifier - Unique identifier (email, IP, or user ID)
 * @param action - Action name (e.g., 'inquiry', 'alumni', 'competition')
 * @returns boolean - true if allowed, false if rate limited
 */
export async function checkRateLimit(identifier: string, action: string): Promise<boolean> {
  // Sanitize identifier to prevent injection
  const safeIdentifier = String(identifier).trim().substring(0, 100)
  const key = `${action}:${safeIdentifier}`
  const now = new Date()
  const resetAt = new Date(now.getTime() + RATE_LIMIT_WINDOW_MS)

  try {
    const existing = await prisma.rateLimit.findUnique({
      where: { key }
    })

    if (!existing) {
      // Create new record
      await prisma.rateLimit.create({
        data: {
          key,
          count: 1,
          resetAt
        }
      })
      return true
    }

    // Check if window expired
    if (existing.resetAt < now) {
      // Reset count
      await prisma.rateLimit.update({
        where: { key },
        data: {
          count: 1,
          resetAt
        }
      })
      return true
    }

    // Check if limit exceeded
    if (existing.count >= MAX_REQUESTS) {
      return false // Rate limit exceeded
    }

    // Increment count
    await prisma.rateLimit.update({
      where: { key },
      data: {
        count: {
          increment: 1
        }
      }
    })
    return true
  } catch (error) {
    console.error('Rate limit error:', error)
    // On error, allow request to prevent DoS
    return true
  }
}

/**
 * Get remaining attempts for a given identifier
 */
export async function getRateLimitStatus(identifier: string, action: string): Promise<{
  remaining: number
  resetAt: Date | null
  total: number
}> {
  const safeIdentifier = String(identifier).trim().substring(0, 100)
  const key = `${action}:${safeIdentifier}`
  const now = new Date()

  try {
    const existing = await prisma.rateLimit.findUnique({
      where: { key }
    })

    if (!existing) {
      return { remaining: MAX_REQUESTS, resetAt: null, total: 0 }
    }

    if (existing.resetAt < now) {
      return { remaining: MAX_REQUESTS, resetAt: null, total: existing.count }
    }

    return {
      remaining: Math.max(0, MAX_REQUESTS - existing.count),
      resetAt: existing.resetAt,
      total: existing.count
    }
  } catch (error) {
    console.error('Rate limit status error:', error)
    return { remaining: MAX_REQUESTS, resetAt: null, total: 0 }
  }
}

/**
 * Clear rate limit for a specific identifier (admin function)
 */
export async function clearRateLimit(identifier: string, action: string): Promise<boolean> {
  const safeIdentifier = String(identifier).trim().substring(0, 100)
  const key = `${action}:${safeIdentifier}`

  try {
    await prisma.rateLimit.delete({
      where: { key }
    })
    return true
  } catch (error) {
    console.error('Rate limit clear error:', error)
    return false
  }
}
