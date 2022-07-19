import { useLoaderData, Link, Outlet } from "@remix-run/react"

// import supabase from '../api/supabase'
// import { getSession } from "~/api/cookie"

import type { LoaderFunction } from "@remix-run/node"
import withAuthRequired from "~/api/withAuthRequired"

export const loader: LoaderFunction = async ({ request }) => {
  const { supabase, redirect } = await withAuthRequired({ request })
  if (redirect) return redirect

  // const session = await getSession(request.headers.get('Cookie'))
  // const accessToken = session.get('accessToken')

  // supabase.auth.setAuth(accessToken)

  const { data: channels, error } = await supabase.from('channels').select('id, title')
  if (error) console.error(error)

  return { channels }
}

export default function Channels() {
  const { channels } = useLoaderData()

  return (
    <div className="h-screen flex">
      <div className="bg-gray-800 w-40 p-8 text-white">
        {channels.map((channel: any) =>
          <p key={channel.id}>
            <Link to={`/channels/${channel.id}`}>
              <span className="text-gray-400 mr-1">
                #
              </span>
              {channel.title}</Link>
          </p>
        )}
      </div>
      <div className="flex-1 p-8 flex flex-col">
        <Outlet />
      </div>
    </div>
  )
}
