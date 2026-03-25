import { createClient } from '@/lib/supabase/server'
import { DonorCard } from '@/components/donor/DonorCard'

export default async function DonorPage({ searchParams }: { searchParams: { blood?: string; session?: string; dept?: string } }) {
  const supabase = createClient()
  let query = supabase.from('profiles').select('*')
  if (searchParams.blood) query = query.eq('blood_group', searchParams.blood)
  if (searchParams.session) query = query.eq('session', searchParams.session)
  if (searchParams.dept) query = query.eq('department', searchParams.dept)
  const { data: donors } = await query

  return (
    <div className="p-4">
      <form method="GET" className="flex flex-wrap gap-2 mb-4">
        <select name="blood" className="border rounded p-2">
          <option value="">Blood Group</option>
          <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
        </select>
        <input name="session" placeholder="Session (e.g., 2022)" className="border rounded p-2" />
        <input name="dept" placeholder="Department" className="border rounded p-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded">Filter</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {donors?.map((donor) => (
          <DonorCard key={donor.id} donor={donor} />
        ))}
      </div>
    </div>
  )
}
