'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export function SearchInput() {
  const [searchInput, setSearchInput] = useState('')
  const router = useRouter()

  function onSubmit(event: FormEvent) {
    event.preventDefault()

    router.push(`/app/groups?q=${searchInput}`)

    setSearchInput('')
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 rounded-md flex-row items-center pr-2 border border-input group"
    >
      <input
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Pesquise um grupo..."
        type="text"
        className="text-sm h-10 px-3 py-2 bg-transparent border-none outline-none"
      />
      <button type="submit" className='bg-transparent border-none'>
        <Search size={18} className="text-muted-foreground" />
      </button>
    </form>
  )
}
