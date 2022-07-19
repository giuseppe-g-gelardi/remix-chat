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
