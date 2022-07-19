import { useEffect } from "react"
import supabase from '../api/supabase'
import { useFetcher } from "@remix-run/react"

import { getSession, destroySession } from '~/api/cookie'
import { redirect } from '@remix-run/node'

import type { ActionFunction } from '@remix-run/node'

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const cookie = await destroySession(session)

  return redirect('/login', {
    headers: {
      "Set-Cookie": cookie
    }
  })
}


export default function Logout() {
  const fetcher = useFetcher()

  useEffect(() => {
    const logout = async () => {

      await supabase.auth.signOut()

      fetcher.submit(null, {
        method: 'post',
        action: '/logout'
      })
    }
    logout()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <p>Logging out...</p>
  )
}
