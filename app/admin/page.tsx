import { createClient } from '@/lib/supabase/server'
import { UserTable } from '@/components/admin/UserTable'
import { ReportsTable } from '@/components/admin/ReportsTable'

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <div>Unauthorized</div>
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return <div>Access Denied</div>

  const { data: users } = await supabase.from('profiles').select('*')
  const { data: reports } = await supabase.from('reports').select('*, reporter:reporter_id(full_name, username)')

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mt-6 mb-2">Users</h2>
      <UserTable users={users} />
      <h2 className="text-xl font-semibold mt-6 mb-2">Reports</h2>
      <ReportsTable reports={reports} />
    </div>
  )
}
