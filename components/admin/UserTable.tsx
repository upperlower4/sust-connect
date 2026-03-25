'use client'
import { createClient } from '@/lib/supabase/client'

export function UserTable({ users }: { users: any[] }) {
  const supabase = createClient()

  const verifyTeacher = async (userId: string) => {
    await supabase.from('profiles').update({ is_teacher: true }).eq('id', userId)
  }

  const toggleAlumni = async (userId: string, isAlumni: boolean) => {
    await supabase.from('profiles').update({ is_alumni: !isAlumni }).eq('id', userId)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Teacher</th>
            <th className="border p-2">Alumni</th>
            <th className="border p-2">Actions</th>
           </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.full_name || user.username}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.is_teacher ? 'Yes' : 'No'}</td>
              <td className="border p-2">{user.is_alumni ? 'Yes' : 'No'}</td>
              <td className="border p-2 space-x-2">
                {!user.is_teacher && (
                  <button onClick={() => verifyTeacher(user.id)} className="bg-green-600 text-white px-2 py-1 rounded">
                    Verify Teacher
                  </button>
                )}
                <button onClick={() => toggleAlumni(user.id, user.is_alumni)} className="bg-blue-600 text-white px-2 py-1 rounded">
                  Toggle Alumni
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
