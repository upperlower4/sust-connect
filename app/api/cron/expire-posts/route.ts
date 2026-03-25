import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  await supabase
    .from('posts')
    .delete()
    .in('type', ['job', 'tuition', 'blood_request'])
    .lt('deadline', today)

  await supabase
    .from('posts')
    .delete()
    .eq('type', 'notice')
    .lt('deadline', today)

  return NextResponse.json({ message: 'Expired posts cleaned' })
}
