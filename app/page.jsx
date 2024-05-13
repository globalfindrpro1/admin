'use client'

import { useAuthContext } from '@/app/context/context'
import { useRouter } from 'next/navigation'
import EventList from '@/app/components/eventList'

export default function Home() {
  const { session, auth, db } = useAuthContext()
  const router = useRouter()

  if (!session) {
    router.push('/auth', { scroll: false })
    return (
      <main>
        <div className='fs-1'>Redirecting...</div>
      </main> 
    )
  }

  return (
    <main className={`text-center w-100 balance`}>
      <EventList auth={auth} session={session} db={db} router={router} />
    </main >
  )
}
