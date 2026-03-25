import { createClient } from '@/lib/supabase/client'

export async function createNotification(userId: string, type: string, referenceId: string) {
  const supabase = createClient()
  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    reference_id: referenceId,
    is_read: false,
  })
}
