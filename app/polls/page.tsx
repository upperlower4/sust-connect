import { createClient } from '@/lib/supabase/server'
import { PollCard } from '@/components/polls/PollCard'

export default async function PollsPage() {
  const supabase = createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('*, polls(*)')
    .eq('type', 'poll')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Polls</h1>
      {posts?.map((post) => (
        <PollCard key={post.id} post={post} poll={post.polls[0]} />
      ))}
    </div>
  )
}
