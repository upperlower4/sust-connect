'use client'
import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function PostCard({ post }: { post: any }) {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<any[]>([])
  const [showComments, setShowComments] = useState(false)
  const [sending, setSending] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchReactions = async () => {
      const { count: likeCount } = await supabase
        .from('reactions')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id)
        .eq('type', 'like')
      setLikes(likeCount || 0)

      const { data: userReaction } = await supabase
        .from('reactions')
        .select('*')
        .eq('post_id', post.id)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('type', 'like')
        .single()
      setLiked(!!userReaction)

      const { data: commentData } = await supabase
        .from('comments')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true })
      setComments(commentData || [])
    }
    fetchReactions()
  }, [post.id, supabase])

  const handleLike = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return
    if (!liked) {
      await supabase.from('reactions').insert({ post_id: post.id, type: 'like' })
      setLikes(likes + 1)
      setLiked(true)
    } else {
      await supabase
        .from('reactions')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .eq('type', 'like')
      setLikes(likes - 1)
      setLiked(false)
    }
  }

  const handleComment = async () => {
    if (!comment.trim()) return
    setSending(true)
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return
    const { data: newComment } = await supabase
      .from('comments')
      .insert({ post_id: post.id, content: comment })
      .select('*, profiles(username, full_name, avatar_url)')
      .single()
    setComments([...comments, newComment])
    setComment('')
    setSending(false)
  }

  const avatarUrl = post.profiles.avatar_url || '/default-avatar.png'
  const isConfession = post.type === 'confession'
  const isBloodRequest = post.type === 'blood_request'
  const displayName = isConfession ? 'Anonymous' : (post.profiles.full_name || post.profiles.username)

  return (
    <div className={`rounded-lg shadow mb-4 p-4 ${isConfession ? 'bg-pink-50 border border-pink-200' : 'bg-white'}`}>
      <div className="flex items-center gap-2">
        {!isConfession && (
          <Image
            src={avatarUrl}
            alt="avatar"
            width={32}
            height={32}
            className="rounded-full"
            unoptimized
          />
        )}
        <div>
          <p className="font-semibold">{displayName}</p>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(post.created_at))} ago
            {isBloodRequest && <span className="ml-2 text-red-600 bg-red-100 px-2 py-0.5 rounded-full text-xs">Emergency</span>}
          </p>
        </div>
      </div>
      <p className="mt-2">{post.content}</p>
      {post.media && post.media.length > 0 && (
        <div className="mt-2">
          <Image src={post.media[0]} alt="post image" width={500} height={500} className="rounded-md" unoptimized />
        </div>
      )}
      <div className="flex gap-4 mt-3">
        <button onClick={handleLike} className="flex items-center gap-1">
          <Heart size={20} fill={liked ? 'red' : 'none'} />
          {likes}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1">
          <MessageCircle size={20} />
          {comments.length}
        </button>
      </div>
      {showComments && (
        <div className="mt-2">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2 text-sm mt-1">
              <span className="font-semibold">{c.profiles.username}</span>
              <span>{c.content}</span>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border rounded px-2 py-1"
              disabled={sending}
            />
            <button onClick={handleComment} disabled={sending}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
