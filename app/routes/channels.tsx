import { useLoaderData, Link, Outlet } from "@remix-run/react"

import supabase from '../api/supabase'

import type { LoaderFunction } from "@remix-run/node"

export const loader: LoaderFunction = async () => {
  const { data: channels, error } = await supabase.from('channels').select('id, title')
  if (error) console.error(error)

  return { channels }
}

export default function Channels() {
  const { channels } = useLoaderData()
  return (
    <div>
      {channels.map((channel: any) => <p key={channel.id}>
        <Link to={`/channels/${channel.id}`}>{channel.title}</Link>
      </p>
      )}
      <Outlet />
    </div>
  )
}
