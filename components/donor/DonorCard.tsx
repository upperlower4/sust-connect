'use client'
import { useRouter } from 'next/navigation'

export function DonorCard({ donor }: { donor: any }) {
  const router = useRouter()

  const startDM = () => {
    router.push(`/messages?userId=${donor.id}`)
  }

  return (
    <div className="border rounded p-4">
      <h3 className="font-bold">{donor.full_name || donor.username}</h3>
      <p>Blood: {donor.blood_group}</p>
      <p>Session: {donor.session}</p>
      <p>Department: {donor.department}</p>
      <p>Last Donation: {donor.last_donation ? new Date(donor.last_donation).toLocaleDateString() : 'Never'}</p>
      <p>Status: {donor.donation_available ? 'Available' : 'Busy'}</p>
      <button onClick={startDM} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded">
        Message
      </button>
    </div>
  )
}
