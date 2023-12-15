'use client'

import { cn } from '@/lib/utils'
import { Activity, Home, LayoutDashboard, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from './ui/button'
import { useAuth } from '@/context/auth-context'

export function Sidebar() {
  const pathname = usePathname()
  const params = useParams()
  const { logout } = useAuth()

  const routes = [
    {
      href: `/app`,
      label: 'Geral',
      icon: Home,
      active: pathname === `/app`,
    },
    {
      href: `/app/groups`,
      label: 'Grupos',
      icon: LayoutDashboard,
      active: pathname === `/app/groups`,
    },
    {
      href: `/app/activities`,
      label: 'Atividades',
      icon: Activity,
      active: pathname === `/app/activities`,
    },
  ]

  return (
    <aside
      className={cn(
        'hidden md:flex w-[200px] z-20 bg-background fixed top-0 left-0 h-screen border-r border-border flex-col gap-8 p-4'
        // sidebar.isOpen && 'flex'
      )}
    >
      <h1 className="p-2 text-3xl">Logo</h1>

      <nav className="flex flex-col gap-2 w-full">
        {routes.map((route) => (
          <Link
            key={route.label}
            href={route.href}
            className={cn(
              'w-full p-2 rounded flex gap-3 items-center text-sm transition-colors hover:bg-primary hover:text-background group',
              route.active && 'bg-primary text-background'
            )}
          >
            <route.icon
              className={cn(
                'w-4 h-4 text-foreground group-hover:text-background',
                route.active && 'bg-primary text-background'
              )}
            />
            {route.label}
          </Link>
        ))}
      </nav>

      <Button
        variant="outline"
        onClick={logout}
        className={cn(
          'text-left border-0 items-center justify-start mt-auto mb-8 w-full p-2 rounded flex gap-3 text-sm transition-colors hover:bg-primary hover:text-background group'
        )}
      >
        <LogOut />
        Sair
      </Button>
    </aside>
  )
}
