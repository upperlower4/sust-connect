'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import CreatePostModal from './CreatePostModal'

export function CreatePostButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-4 bg-blue-600 text-white rounded-full p-3 shadow-lg z-50"
      >
        <Plus size={28} />
      </button>
      {open && <CreatePostModal onClose={() => setOpen(false)} />}
    </>
  )
}
