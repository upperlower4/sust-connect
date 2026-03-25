'use client'
import { createClient } from '@/lib/supabase/client'

export function ReportsTable({ reports }: { reports: any[] }) {
  const supabase = createClient()

  const resolveReport = async (reportId: string, action: 'delete' | 'ignore') => {
    if (action === 'delete') {
      const report = reports.find(r => r.id === reportId)
      if (report.reported_type === 'post') {
        await supabase.from('posts').delete().eq('id', report.reported_id)
      }
      // Add other types as needed
    }
    await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Reporter</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Content</th>
            <th className="border p-2">Reason</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports?.map((report) => (
            <tr key={report.id}>
              <td className="border p-2">{report.reporter?.full_name || report.reporter?.username}</td>
              <td className="border p-2">{report.reported_type}</td>
              <td className="border p-2">{report.post?.content || 'N/A'}</td>
              <td className="border p-2">{report.reason}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => resolveReport(report.id, 'delete')} className="bg-red-600 text-white px-2 py-1 rounded">
                  Delete & Resolve
                </button>
                <button onClick={() => resolveReport(report.id, 'ignore')} className="bg-gray-600 text-white px-2 py-1 rounded">
                  Ignore
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
