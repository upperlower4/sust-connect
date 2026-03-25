'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createNotification } from '@/lib/utils'

export function ChatWindow({ friend }: { friend: any }) {
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user))
  }, [supabase])

  useEffect(() => {
    if (!currentUser) return
    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${friend.id}),and(sender_id.eq.${friend.id},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true })
      setMessages(data || [])
      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', currentUser.id)
        .eq('sender_id', friend.id)
        .eq('is_read', false)
    }
    loadMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUser.id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
        // Mark as read immediately
        supabase
          .from('messages')
          .update({ is_read: true })
          .eq('id', payload.new.id)
          .then()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [currentUser, friend.id, supabase])

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return
    const { data: newMsg } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUser.id,
        receiver_id: friend.id,
        content: newMessage,
      })
      .select()
      .single()
    setMessages([...messages, newMsg])
    setNewMessage('')
    // Create notification for the receiver
    await createNotification(friend.id, 'message', newMsg.id)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-2 font-bold">{friend.full_name || friend.username}</div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-3 py-1 max-w-xs ${msg.sender_id === currentUser?.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-2 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-3 rounded">Send</button>
      </div>
    </div>
  )
}
