import { ReactNode } from 'react'
import { BottomNav } from '@/components/ui/BottomNav'
import { createClient } from '@/lib/supabase/server'
import { OnlineFriends } from '@/components/dm/OnlineFriends'
import './globals.css'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let friends: any[] = []
  if (user) {
    const { data } = await supabase
      .from('friends')
      .select('friend_id, profiles(id, username, full_name, avatar_url)')
      .eq('user_id', user.id)
      .eq('status', 'accepted')
    friends = data?.map(f => f.profiles) || []
  }

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <main className="flex-1 max-w-2xl mx-auto p-4 pb-16 md:pb-4">
            {children}
          </main>
          <aside className="hidden md:block w-80 border-l p-4">
            <h3 className="font-semibold mb-2">Online Friends</h3>
            <OnlineFriends friends={friends} />
          </aside>
        </div>
        <BottomNav />
      </body>
    </html>
  )
}
