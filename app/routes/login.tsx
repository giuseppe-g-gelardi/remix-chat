import { Link } from "@remix-run/react"
import supabase from '../api/supabase'
import type { SyntheticEvent } from "react"

import { redirect } from "@remix-run/node"
import { commitSession, getSession } from "~/api/cookie"


import type { ActionFunction } from "@remix-run/node"

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const accessToken = form.get('accessToken')
  const session = await getSession()
  session.set('accessToken', accessToken)
  const cookie = await commitSession(session) as string

  return redirect('/channels', {
    headers: {
      "Set-Cookie": cookie
    }
  })
}

export default function login() {

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault()

    const form = new FormData(e.target as HTMLFormElement)
    const email = form.get('email') as string
    const password = form.get('password') as string

    console.log({email, password})

    // const { error } = await supabase.auth.signIn({
    const { data, error } = await supabase.auth.signIn({
      email,
      password
    })

    console.log({ data, error })
    // console.log({ error })
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="text-4xl mb-4">
        Login
      </h1>
      <form className="flex flex-col mb-4" onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input 
          name="email" 
          className="border border-gray-200 bg-transparent mb-4 px-2" 
          placeholder="lovelace@turing.com"
        />
        <label htmlFor="password">Password</label>
        <input 
          type='password'
          name="password" 
          className="border border-gray-200 bg-transparent mb-8 px-2" 
          placeholder="Password"
        />
        <button className="bg-gray-700 py-2">Go!@</button>
      </form>
      <p>Don't have an account? <Link to='/register'>Register 👉</Link></p>

    </div>
  )
}
