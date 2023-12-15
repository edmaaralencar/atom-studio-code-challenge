import { LucideIcon } from 'lucide-react'

type CardProps = {
  title: string
  message: string
  icon: LucideIcon
}

export function Card({ title, message, icon: Icon }: CardProps) {
  return (
    <div className="border border-border flex flex-col gap-2 justify-between p-4 rounded-md">
      <header className="flex justify-between items-center">
        <p>{title}</p>

        <Icon size={18} />
      </header>

      <strong>{message}</strong>
    </div>
  )
}
