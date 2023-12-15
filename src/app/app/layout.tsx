import { NotificationDropdown } from '@/components/notifications-dropdown'
import { ProfileHeader } from '@/components/profile-header'
import { Sidebar } from '@/components/sidebar'
import { ReactNode } from 'react'
import { SearchInput } from './_components/search-input'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full">
      <Sidebar />

      <div className="md:ml-[200px] flex flex-col h-full">
        <header className="p-6 w-full border-b border-border flex justify-between items-center">
          <SearchInput />
          <div className="flex flex-row gap-1">
            <ProfileHeader />
            <NotificationDropdown />
          </div>
        </header>
        <main className="p-6 h-full">{children}</main>
      </div>
    </div>
  )
}
