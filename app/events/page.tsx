import { createClient } from '@/lib/supabase/server'
import { EventCard } from '@/components/events/EventCard'
import Link from 'next/link'

export default async function EventsPage() {
  const supabase = createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*, profiles(full_name, username, avatar_url)')
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })

  const { data: { user } } = await supabase.auth.getUser()
  let canCreate = false
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('is_teacher, is_admin').eq('id', user.id).single()
    canCreate = profile?.is_teacher || profile?.is_admin || false
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Upcoming Events</h1>
        {canCreate && (
          <Link href="/events/create" className="bg-blue-600 text-white px-4 py-2 rounded">
            Create Event
          </Link>
        )}
      </div>
      <div className="grid gap-4">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
