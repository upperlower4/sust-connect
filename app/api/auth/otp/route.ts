import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email } = await req.json()
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOtp({ email })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ message: 'OTP sent' })
}
