import { redirect } from "@remix-run/node"
import { commitSession, getSession } from "~/api/cookie"

import type { ActionFunction } from "@remix-run/node"

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const accessToken = form.get('accessToken')
  const session = await getSession()
  session.set('accessToken', accessToken)
  const cookie = await commitSession(session)

  return redirect('/channels', {
    headers: {
      'Set-Cookie': cookie,
    }
  })
}

export default function Auth() {
  return (<><p>login...</p></>)
}
