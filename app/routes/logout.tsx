import { useEffect } from "react"
import supabase from '../api/supabase'

export default function Logout() {

  useEffect(() => {
    supabase.auth.signOut()
  })

  return (
    <p>Logging out...</p>
  )
}
