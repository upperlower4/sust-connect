'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function OnlineFriends({ friends, onSelect, selectedId }: any) {
  const [onlineStatus, setOnlineStatus] = useState<Record<string, boolean>>({})
  const supabase = createClient()

  useEffect(() => {
    const fetchOnlineStatus = async () => {
      if (!friends.length) return
      const { data } = await supabase
        .from('online_status')
        .select('user_id, last_active')
        .in('user_id', friends.map((f: any) => f.id))
      const status: Record<string, boolean> = {}
      data?.forEach((row) => {
        const diff = Date.now() - new Date(row.last_active).getTime()
        status[row.user_id] = diff < 2 * 60 * 1000
      })
      setOnlineStatus(status)
    }
    fetchOnlineStatus()
    const interval = setInterval(fetchOnlineStatus, 30000)
    return () => clearInterval(interval)
  }, [friends, supabase])

  if (!onSelect) {
    // Just show list with status (used in sidebar)
    return (
      <div>
        {friends.map((friend: any) => (
          <div key={friend.id} className="flex items-center gap-2 p-2 border-b">
            <span className={`h-2 w-2 rounded-full ${onlineStatus[friend.id] ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <span className="font-medium">{friend.full_name || friend.username}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {friends.map((friend: any) => (
        <div
          key={friend.id}
          onClick={() => onSelect(friend)}
          className={`p-3 hover:bg-gray-100 cursor-pointer ${selectedId === friend.id ? 'bg-gray-100' : ''}`}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {onlineStatus[friend.id] && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${onlineStatus[friend.id] ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            </span>
            <span className="font-semibold">{friend.full_name || friend.username}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
