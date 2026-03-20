import { getAuditLogs } from "@/lib/audit"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AuditLogPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; resource?: string }>
}) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const params = await searchParams
  const page = parseInt(params.page || '1')
  const resource = params.resource as any || undefined

  const { logs, total, totalPages, currentPage } = await getAuditLogs({
    page,
    limit: 50,
    resource
  })

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActionColor = (action: string) => {
    switch(action) {
      case 'CREATE': return 'bg-emerald-100 text-emerald-800'
      case 'UPDATE': return 'bg-blue-100 text-blue-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      case 'LOGIN': return 'bg-purple-100 text-purple-800'
      case 'LOGOUT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Audit Log</h1>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <a href="/dashboard/audit" className={`px-4 py-2 rounded ${!resource ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}>
          Semua
        </a>
        {['USER', 'POST', 'INQUIRY', 'COMPETITION', 'SUBMISSION'].map(res => (
          <a key={res} href={`/dashboard/audit?resource=${res}`} className={`px-4 py-2 rounded ${resource === res ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}>
            {res}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(log.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.user ? (
                    <div>
                      <div>{log.user.name}</div>
                      <div className="text-gray-500 text-xs">@{log.user.username}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Guest</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.resource}
                  {log.resourceId && <span className="text-gray-400"> #{log.resourceId}</span>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {log.details && (
                    <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded max-w-md overflow-x-auto">
                      {typeof log.details === 'string' ? log.details : JSON.stringify(JSON.parse(log.details), null, 2)}
                    </pre>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => Math.abs(p - currentPage) <= 2)
            .map(p => (
              <a key={p} href={`/dashboard/audit?page=${p}${resource ? `&resource=${resource}` : ''}`}
                className={`px-3 py-2 rounded ${p === currentPage ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}>
                {p}
              </a>
            ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Total: {total} logs
      </div>
    </div>
  )
}
