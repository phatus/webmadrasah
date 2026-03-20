import prisma from '@/lib/db'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'ACCESS' | 'SUBMIT' | 'VERIFY'
export type AuditResource = 'POST' | 'USER' | 'ALUMNI' | 'INQUIRY' | 'COMPETITION' | 'SUBMISSION' | 'ANNOUNCEMENT' | 'SETTINGS' | 'CATEGORY' | 'GALLERY' | 'TEACHER' | 'FACILITY' | 'EXTRACURRICULAR' | 'ACHIEVEMENT' | 'VIDEO' | 'FEATURED_PROGRAM' | 'PAGE_CONTENT' | 'COMPETITION_SUBMISSION'

export interface AuditLogInput {
  userId?: number
  action: AuditAction
  resource: AuditResource
  resourceId?: number
  details?: object | string | null
  ipAddress?: string
  userAgent?: string
}

/**
 * Log an audit event to the database
 * Runs in background and won't block the main operation
 */
export async function logAudit(input: AuditLogInput): Promise<void> {
  try {
    // Convert details to JSON string if it's an object
    let detailsString: string | null = null
    if (input.details) {
      if (typeof input.details === 'string') {
        detailsString = input.details
      } else {
        detailsString = JSON.stringify(input.details)
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        resource: input.resource,
        resourceId: input.resourceId,
        details: detailsString,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      }
    })
  } catch (error) {
    // Audit logging should never break the main function
    // Silently fail but log to console for debugging
    console.error('Audit log failed:', error)
  }
}

/**
 * Get audit logs with pagination and filtering
 */
export async function getAuditLogs(
  options: {
    page?: number
    limit?: number
    resource?: AuditResource
    action?: AuditAction
    userId?: number
    startDate?: Date
    endDate?: Date
  } = {}
): Promise<{
  logs: Array<{
    id: number
    userId: number | null
    action: AuditAction
    resource: AuditResource
    resourceId: number | null
    details: string | null
    createdAt: Date
    user?: {
      id: number
      name: string | null
      username: string | null
      role: string | null
    } | null
  }>
  total: number
  totalPages: number
  currentPage: number
}> {
  const { page = 1, limit = 50, ...filters } = options
  const skip = (page - 1) * limit

  const where: any = {}

  if (filters.resource) {
    where.resource = filters.resource
  }
  if (filters.action) {
    where.action = filters.action
  }
  if (filters.userId !== undefined) {
    where.userId = filters.userId
  }
  if (filters.startDate || filters.endDate) {
    where.createdAt = {}
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate
    }
    if (filters.endDate) {
      where.createdAt.lte = filters.endDate
    }
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            role: true
          }
        }
      }
    }),
    prisma.auditLog.count({ where })
  ])

  return {
    logs,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  }
}

/**
 * Helper to get IP address from Next.js request (if available in Server Actions)
 * Note: Server Actions don't directly expose request headers, so this may be limited
 */
export function getClientIp(): string | null {
  // In Next.js Server Actions, getting real client IP is tricky
  // Usually need to use middleware or API routes to capture
  // Returning placeholder - implement based on your deployment
  return '0.0.0.0'
}
