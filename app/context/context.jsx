'use client'

import { useState, createContext, useContext } from 'react'
import { auth, db } from '@/app/lib/firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Loading from '../components/loading/loading'

const Context = createContext()

export function ContextProvider({ children }) {

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in.
      localStorage.setItem('TOKEN', user.accessToken);
      setSession(user)
    } else {
      // User is signed out.
      setSession(null)
    }
    setLoading(false)
  })

  if (loading) {
    return (
      <main>
        <Loading />
      </main>
    )
  } else {
    return (
      <Context.Provider value={{ session, auth, db }}>
        {children}
      </Context.Provider>
    )
  }

}

export function useAuthContext() {
  return useContext(Context)
}