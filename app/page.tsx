import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/feed/PostCard'
import { CreatePostButton } from '@/components/feed/CreatePostButton'

export default async function FeedPage() {
  const supabase = createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(username, full_name, avatar_url, is_teacher)')
    .order('created_at', { ascending: false })

  return (
    <>
      <CreatePostButton />
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  )
}
