'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [isTeacher, setIsTeacher] = useState(false)
  const [teacherDept, setTeacherDept] = useState('')
  const [teacherDesignation, setTeacherDesignation] = useState('')
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password: 'temporary',
      options: {
        data: {
          full_name: fullName,
          birth_date: `${year}-${month}-${day}`,
          is_teacher: isTeacher,
          teacher_department: teacherDept,
          teacher_designation: teacherDesignation,
        },
      },
    })
    if (!error) {
      router.push(`/auth/verify-otp?email=${email}`)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <div className="flex gap-2">
          <input type="text" placeholder="DD" value={day} onChange={(e) => setDay(e.target.value)} required className="w-1/3 border p-2 rounded" />
          <input type="text" placeholder="MM" value={month} onChange={(e) => setMonth(e.target.value)} required className="w-1/3 border p-2 rounded" />
          <input type="text" placeholder="YYYY" value={year} onChange={(e) => setYear(e.target.value)} required className="w-1/3 border p-2 rounded" />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={isTeacher} onChange={(e) => setIsTeacher(e.target.checked)} />
          Sign up as Teacher
        </label>
        {isTeacher && (
          <>
            <input
              type="text"
              placeholder="Department"
              value={teacherDept}
              onChange={(e) => setTeacherDept(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Designation"
              value={teacherDesignation}
              onChange={(e) => setTeacherDesignation(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </>
        )}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  )
}
