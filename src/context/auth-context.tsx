'use client'

import { auth, db, provider } from '@/lib/firebase'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  where,
} from 'firebase/firestore'
import { usePathname, useRouter } from 'next/navigation'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import toast from 'react-hot-toast'

type AuthContextData = {
  signUpWithEmail: (credentials: AuthCredentials) => Promise<void>
  signInWithEmail: (credentials: AuthCredentials) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  user: IUser | null
}

const AuthContext = createContext({} as AuthContextData)

type AuthCredentials = {
  email: string
  password: string
}

interface IUser {
  id: string
  email: string
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  async function signUpWithEmail(credentials: AuthCredentials) {
    try {
      await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )

      toast.success('Usuário cadastrado com sucesso')
    } catch (error: any) {
      if (error.message.includes('email-already-in-use')) {
        toast.error('Usuário já existe com esse e-mail')
        return
      }

      toast.error('Ocorreu um erro')
    }
  }

  async function signInWithEmail(credentials: AuthCredentials) {
    try {
      await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )

      toast.success('Usuário entrou com sucesso')
    } catch (error: any) {
      if (error.message.includes('invalid-credential')) {
        toast.error('Credenciais inválidas')
        return
      }
      toast.error('Ocorreu um erro')
    }
  }

  async function logout() {
    try {
      await signOut(auth)

      toast.success('Usuário saiu da aplicação com sucesso')
    } catch (error) {
      toast.error('Ocorreu um erro')
    }
  }

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, provider)

      toast.success('Usuário entrou com sucesso')
    } catch (error) {
      toast.error('Ocorreu um erro')
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        setUser({
          email: user.email,
          id: user.uid,
        })

        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
          })
        }

        if (
          pathname.startsWith('/sign-in') ||
          pathname.startsWith('/sign-up')
        ) {
          router.push('/app')
        }
      } else {
        setUser(null)

        if (pathname.startsWith('/app')) {
          router.push('/sign-in')
        }
      }
    })

    return () => unsubscribe()
  }, [pathname, router])

  return (
    <AuthContext.Provider
      value={{
        user,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
