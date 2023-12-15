import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-4 text-center max-w-md">
        <h1 className="text-2xl">
          Essa seria uma tela inicial vendendo o produto.
        </h1>
        <span className="text-muted-foreground text-lg">
          Para prosseguir, faça o login!
        </span>

        <Button asChild>
          <Link href="/sign-in">Login</Link>
        </Button>
      </div>
    </main>
  )
}
