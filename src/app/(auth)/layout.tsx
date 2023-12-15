import Image from 'next/image'
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-screen h-screen">
      <div className="hidden md:block relative bg-muted">
        {/* <Image src="/" alt="Oi" fill /> */}
      </div>
      <div className="flex items-center justify-center relative">
        <div className="w-full max-w-sm px-4">{children}</div>
      </div>
    </div>
  )
}
