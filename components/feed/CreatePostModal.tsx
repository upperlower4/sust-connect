'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/cloudinary'
import { X } from 'lucide-react'

const POST_TYPES = ['general', 'confession', 'notice', 'job', 'tuition', 'blood_request', 'poll']

export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState('general')
  const [content, setContent] = useState('')
  const [media, setMedia] = useState<File[]>([])
  const [bloodGroup, setBloodGroup] = useState('')
  const [bags, setBags] = useState(1)
  const [hospital, setHospital] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [deadline, setDeadline] = useState('')
  const [pollQuestion, setPollQuestion] = useState('')
  const [pollOptions, setPollOptions] = useState(['', ''])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const supabase = createClient()
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    let mediaUrls: string[] = []
    for (const file of media) {
      const url = await uploadImage(file, 'post-images')
      mediaUrls.push(url)
    }

    const postData: any = {
      user_id: user.id,
      type,
      content,
      media: mediaUrls,
      deadline: deadline ? new Date(deadline).toISOString() : null,
    }
    if (type === 'blood_request') {
      postData.blood_group = bloodGroup
      postData.bags_needed = bags
      postData.hospital = hospital
      postData.contact_phone = contactPhone
    }

    if (type === 'poll') {
      // First insert post
      const { data: newPost } = await supabase
        .from('posts')
        .insert({ user_id: user.id, type: 'poll', content: pollQuestion })
        .select()
        .single()
      // Then insert poll
      await supabase.from('polls').insert({
        post_id: newPost.id,
        question: pollQuestion,
        options: pollOptions.filter(opt => opt.trim() !== ''),
      })
    } else {
      await supabase.from('posts').insert(postData)
    }

    setLoading(false)
    onClose()
    window.location.reload()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Create Post</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {POST_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1 rounded-full ${type === t ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        {type !== 'poll' && (
          <>
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded p-2 mt-2"
              rows={4}
            />
            <input type="file" multiple onChange={(e) => setMedia(Array.from(e.target.files || []))} className="mt-2" />
          </>
        )}

        {type === 'poll' && (
          <div className="mt-2 space-y-2">
            <input
              type="text"
              placeholder="Poll question"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              className="w-full border p-2 rounded"
            />
            {pollOptions.map((opt, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...pollOptions]
                    newOpts[idx] = e.target.value
                    setPollOptions(newOpts)
                  }}
                  className="flex-1 border p-2 rounded"
                />
                {idx > 1 && (
                  <button type="button" onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setPollOptions([...pollOptions, ''])}>
              + Add option
            </button>
          </div>
        )}

        {type === 'blood_request' && (
          <div className="mt-2 space-y-2">
            <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full border p-2">
              <option value="">Select Blood Group</option>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
            </select>
            <input type="number" placeholder="Number of bags" value={bags} onChange={(e) => setBags(parseInt(e.target.value))} className="w-full border p-2" />
            <input type="text" placeholder="Hospital / Clinic" value={hospital} onChange={(e) => setHospital(e.target.value)} className="w-full border p-2" />
            <input type="text" placeholder="Contact Number" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full border p-2" />
          </div>
        )}

        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full border p-2 mt-2" />
        <button onClick={handleSubmit} disabled={loading} className="mt-3 bg-blue-600 text-white w-full py-2 rounded">
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}
