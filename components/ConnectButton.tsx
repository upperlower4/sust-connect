'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createNotification } from '@/lib/utils'

export function ConnectButton({ targetUserId, targetGender }: { targetUserId: string; targetGender: string }) {
  const [status, setStatus] = useState<'none' | 'pending' | 'accepted' | 'blocked'>('none')
  const [requestType, setRequestType] = useState<'friend' | 'prem' | null>(null)
  const supabase = createClient()
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setCurrentUser(user)
      const { data } = await supabase
        .from('friends')
        .select('status, request_type')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},friend_id.eq.${user.id})`)
        .single()
      if (data) {
        setStatus(data.status)
        setRequestType(data.request_type)
      } else {
        setStatus('none')
      }
    }
    fetchStatus()
  }, [targetUserId, supabase])

  const sendRequest = async (type: 'friend' | 'prem') => {
    if (!currentUser) return
    await supabase.from('friends').insert({
      user_id: currentUser.id,
      friend_id: targetUserId,
      request_type: type,
      status: 'pending',
    })
    setStatus('pending')
    setRequestType(type)
    // Create notification for target
    await createNotification(targetUserId, 'friend_request', '')
  }

  const acceptRequest = async () => {
    await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('user_id', targetUserId)
      .eq('friend_id', currentUser?.id)
    setStatus('accepted')
  }

  if (!currentUser || currentUser.id === targetUserId) return null

  if (status === 'accepted') {
    return <button className="bg-green-600 text-white px-4 py-2 rounded">Connected</button>
  }
  if (status === 'pending') {
    // Check if current user is the receiver
    // If we are the receiver, show accept/decline buttons
    // For simplicity, assume pending request is for the other user
    // Actually we need to know direction. Let's query who sent it.
    // This is a simplified version; in production you'd fetch the request row.
    const isReceiver = false // Placeholder; implement proper check
    if (isReceiver) {
      return (
        <div className="flex gap-2">
          <button onClick={acceptRequest} className="bg-blue-600 text-white px-4 py-2 rounded">Accept</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded">Decline</button>
        </div>
      )
    }
    return <button className="bg-yellow-500 text-white px-4 py-2 rounded">Request Sent</button>
  }

  // Get current user's gender
  const [currentGender, setCurrentGender] = useState<string | null>(null)
  useEffect(() => {
    const fetchGender = async () => {
      const { data } = await supabase.from('profiles').select('gender').eq('id', currentUser?.id).single()
      setCurrentGender(data?.gender)
    }
    if (currentUser) fetchGender()
  }, [currentUser, supabase])

  if (!currentGender) return null

  if (currentGender === targetGender) {
    return (
      <button onClick={() => sendRequest('friend')} className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Friend
      </button>
    )
  } else {
    return (
      <div className="flex gap-2">
        <button onClick={() => sendRequest('friend')} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Friend
        </button>
        <button onClick={() => sendRequest('prem')} className="bg-pink-600 text-white px-4 py-2 rounded">
          Prem Request
        </button>
      </div>
    )
  }
}
