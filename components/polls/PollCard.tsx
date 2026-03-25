'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function PollCard({ post, poll }: any) {
  const [selected, setSelected] = useState<number | null>(null)
  const [results, setResults] = useState<number[]>([])
  const [voted, setVoted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchVotes = async () => {
      const { data } = await supabase
        .from('poll_votes')
        .select('option_index')
        .eq('poll_id', poll.id)
      const counts = poll.options.map((_: any, i: number) =>
        data?.filter((v: any) => v.option_index === i).length || 0
      )
      setResults(counts)
      // Check if user has voted
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userVote } = await supabase
          .from('poll_votes')
          .select('option_index')
          .eq('poll_id', poll.id)
          .eq('user_id', user.id)
          .single()
        if (userVote) {
          setSelected(userVote.option_index)
          setVoted(true)
        }
      }
    }
    fetchVotes()
  }, [poll.id, supabase])

  const vote = async (index: number) => {
    if (voted) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('poll_votes').insert({
      poll_id: poll.id,
      user_id: user.id,
      option_index: index,
    })
    setSelected(index)
    setVoted(true)
    // Refresh results
    const { data } = await supabase
      .from('poll_votes')
      .select('option_index')
      .eq('poll_id', poll.id)
    const newCounts = poll.options.map((_: any, i: number) =>
      data?.filter((v: any) => v.option_index === i).length || 0
    )
    setResults(newCounts)
  }

  const totalVotes = results.reduce((a, b) => a + b, 0)

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <p className="font-semibold">{post.content}</p>
      <div className="mt-3 space-y-2">
        {poll.options.map((opt: string, idx: number) => (
          <div key={idx}>
            <button
              onClick={() => vote(idx)}
              disabled={voted}
              className={`w-full text-left p-2 rounded ${selected === idx ? 'bg-blue-100 border border-blue-600' : 'bg-gray-100'} ${!voted && 'hover:bg-gray-200'}`}
            >
              {opt}
            </button>
            {voted && (
              <div className="text-xs text-gray-500 mt-1">
                {results[idx]} vote{results[idx] !== 1 ? 's' : ''} ({totalVotes ? ((results[idx] / totalVotes) * 100).toFixed(0) : 0}%)
              </div>
            )}
          </div>
        ))}
      </div>
      {voted && <p className="text-green-600 text-sm mt-2">Thank you for voting!</p>}
    </div>
  )
}
