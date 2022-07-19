

import { useLoaderData, Form, useFetcher } from "@remix-run/react"

import { useEffect, useState } from "react"

import supabase from '../../api/supabase'

import type { LoaderFunction, ActionFunction } from "@remix-run/node"


export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data: channel, error } = await supabase
    .from('channels')
    .select('id, title, description, messages(id, content)')
    .match({ id })
    .single()

  if (error) console.error(error)

  return { channel }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const content = form.get('content')
  const channelId = form.get('channelId')

  const { data, error } = await supabase
    .from('messages').insert({ content, channel_id: channelId })
  if (error) console.error(error.message)

  console.log(data)

  return null;
}

export default function ChannelId() {
  const { channel } = useLoaderData()
  const [messages, setMessages] = useState([...channel.messages])
  const fetcher = useFetcher()

  useEffect(() => {
    supabase
      .from(`messages:channel_id=eq.${channel.id}`)
      .on('*', (_payload: any) => {
        // setMessages(current => [...current, { id: payload.new.id, content: payload.new.content }])
        fetcher.load(`/channels/${channel.id}`)
      })
      .subscribe()

  }, [channel.id, fetcher])

  useEffect(() => {
    if (fetcher.data) {
      setMessages([...fetcher.data.channel.messages])
    }
  }, [fetcher.data])

  useEffect(() => {
    setMessages([...channel.messages])
  }, [channel])

  return (
    <div>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
      <Form method='post'>
        <input name='content' />
        <input type='hidden' name='channelId' value={channel.id} />
        <button type="submit">send!</button>
      </Form>
    </div>
  )
}
