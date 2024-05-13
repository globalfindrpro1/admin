'use client'

import { useAuthContext } from '../context/context'
import { useRouter } from 'next/navigation'
import SignIn from './sign-in'
export default function AuthForm() {

  const { auth } = useAuthContext()
  const router = useRouter()

  return (
    <main>
      <SignIn auth={auth} router={router}  />
    </main>
  )
}