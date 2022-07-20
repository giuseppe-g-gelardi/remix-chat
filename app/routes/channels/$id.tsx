import { useLoaderData, Form, useFetcher } from "@remix-run/react"
import { useEffect, useState } from "react"

import supabase from '../../api/supabase'

import type { LoaderFunction, ActionFunction } from "@remix-run/node"

import withAuthRequired from "~/api/withAuthRequired"

export const loader: LoaderFunction = async ({ params: { id }, request }) => {

  const { supabase, redirect } = await withAuthRequired({ request })
  if (redirect) return redirect

  const { data: channel, error } = await supabase
    .from('channels')
    .select('id, title, description, messages(id, content, profiles(*))')
    .match({ id })
    .single()

  if (error) console.error(error)


  return { channel }
}

export const action: ActionFunction = async ({ request }) => {
  const { supabase, redirect } = await withAuthRequired({ request })
  if (redirect) return redirect

  const form = await request.formData()
  const content = form.get('content')
  const channelId = form.get('channelId')

  // const { data, error } = await supabase
  const { error } = await supabase
    .from('messages').insert({ content, channel_id: channelId })
  if (error) console.error(error.message)
  // console.log(data)

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
    <>
    <h1 className="text-2xl uppercase mb-2">{channel.title}</h1>
    <p className="text-gray-600 border-b border-gray-300 pb-6">{channel.description}</p>
      <div className="flex-1 flex flex-col p-2 overflow-auto">
        <div className="mt-auto">
          {messages.map((message: any) => (
            <p key={message.id} className="p-2">{message.content}</p>
          ))}
        </div>
      </div>
      <Form method='post' className="flex">
        <input name='content' className="border border-gray-200 px-2 flex-1" />
        <input type='hidden' name='channelId' value={channel.id} />
        <button type="submit" className="px-4 py-2 ml-4 bg-blue-200">send!</button>
      </Form>
    </>
  )
}
