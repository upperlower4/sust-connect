'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function VerifyOTPPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleVerify = async () => {
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' })
    if (error) {
      setError(error.message)
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">Verify OTP</h1>
      <p className="mb-4">Enter the 6-digit code sent to {email}</p>
      <input
        type="text"
        placeholder="6-digit code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button onClick={handleVerify} className="w-full bg-blue-600 text-white py-2 rounded">
        Verify
      </button>
    </div>
  )
}
