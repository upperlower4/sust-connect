'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { ChatWindow } from '@/components/dm/ChatWindow'
import { OnlineFriends } from '@/components/dm/OnlineFriends'

export default function MessagesPage() {
  const [friends, setFriends] = useState<any[]>([])
  const [selectedFriend, setSelectedFriend] = useState<any>(null)
  const searchParams = useSearchParams()
  const userIdParam = searchParams.get('userId')
  const supabase = createClient()

  useEffect(() => {
    const loadFriends = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('friends')
        .select('friend_id, profiles(id, username, full_name, avatar_url)')
        .eq('user_id', user.id)
        .eq('status', 'accepted')
      const friendsList = data?.map((f: any) => f.profiles) || []
      setFriends(friendsList)
      if (userIdParam) {
        const friend = friendsList.find((f: any) => f.id === userIdParam)
        if (friend) setSelectedFriend(friend)
      }
    }
    loadFriends()
  }, [userIdParam, supabase])

  return (
    <div className="flex h-screen">
      <div className="w-80 border-r overflow-y-auto">
        <OnlineFriends friends={friends} onSelect={setSelectedFriend} selectedId={selectedFriend?.id} />
      </div>
      <div className="flex-1">
        {selectedFriend ? (
          <ChatWindow friend={selectedFriend} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">Select a friend to chat</div>
        )}
      </div>
    </div>
  )
}
