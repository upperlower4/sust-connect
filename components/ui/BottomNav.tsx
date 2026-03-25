'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, MessageCircle, Calendar, User } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()
  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/donor', icon: Users, label: 'Donors' },
    { href: '/messages', icon: MessageCircle, label: 'Messages' },
    { href: '/events', icon: Calendar, label: 'Events' },
    { href: '/profile/me', icon: User, label: 'Profile' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2 md:hidden">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={`p-2 ${pathname === link.href ? 'text-blue-600' : 'text-gray-600'}`}>
          <link.icon size={24} />
          <span className="text-xs">{link.label}</span>
        </Link>
      ))}
    </nav>
  )
}
