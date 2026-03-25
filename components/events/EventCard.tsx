'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import Image from 'next/image'

export function EventCard({ event }: { event: any }) {
  const [going, setGoing] = useState(false)
  const [interested, setInterested] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchReactions = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: goingData } = await supabase
        .from('reactions')
        .select('*')
        .eq('post_id', event.id)
        .eq('user_id', user.id)
        .eq('type', 'going')
        .single()
      setGoing(!!goingData)
      const { data: interestedData } = await supabase
        .from('reactions')
        .select('*')
        .eq('post_id', event.id)
        .eq('user_id', user.id)
        .eq('type', 'interested')
        .single()
      setInterested(!!interestedData)
    }
    fetchReactions()
  }, [event.id, supabase])

  const handleReaction = async (type: 'going' | 'interested') => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    // Check if already reacted
    const { data: existing } = await supabase
      .from('reactions')
      .select('type')
      .eq('post_id', event.id)
      .eq('user_id', user.id)
      .single()
    if (existing) {
      await supabase.from('reactions').delete().eq('post_id', event.id).eq('user_id', user.id)
      if (existing.type === 'going') setGoing(false)
      if (existing.type === 'interested') setInterested(false)
    }
    await supabase.from('reactions').insert({ post_id: event.id, type })
    if (type === 'going') setGoing(true)
    if (type === 'interested') setInterested(true)
  }

  return (
    <div className="border rounded p-4">
      {event.image_url && (
        <Image src={event.image_url} alt={event.title} width={400} height={200} className="rounded mb-2" unoptimized />
      )}
      <h2 className="text-xl font-bold">{event.title}</h2>
      <p className="text-gray-600">{format(new Date(event.start_time), 'PPP p')}</p>
      <p className="mt-2">{event.description}</p>
      <p className="text-sm text-gray-500">Location: {event.location}</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => handleReaction('going')}
          className={`px-3 py-1 rounded ${going ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Going
        </button>
        <button
          onClick={() => handleReaction('interested')}
          className={`px-3 py-1 rounded ${interested ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Interested
        </button>
      </div>
    </div>
  )
}
