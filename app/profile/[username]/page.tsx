import { createClient } from '@/lib/supabase/server'
import { ConnectButton } from '@/components/ConnectButton'
import Image from 'next/image'

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()
  if (!profile) return <div>User not found</div>

  const { data: { user } } = await supabase.auth.getUser()
  const isOwnProfile = user?.id === profile.id

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-4">
        <Image
          src={profile.avatar_url || '/default-avatar.png'}
          alt={profile.username}
          width={80}
          height={80}
          className="rounded-full"
          unoptimized
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
          <p className="text-gray-600">@{profile.username}</p>
          {!isOwnProfile && <ConnectButton targetUserId={profile.id} targetGender={profile.gender} />}
        </div>
      </div>
      <div className="mt-4">
        <p>Department: {profile.department}</p>
        <p>Session: {profile.session}</p>
        <p>Blood Group: {profile.blood_group}</p>
        {profile.is_teacher && <p className="text-green-600">✓ Verified Teacher</p>}
        {profile.is_alumni && <p className="text-blue-600">🎓 Alumni</p>}
      </div>
    </div>
  )
}
