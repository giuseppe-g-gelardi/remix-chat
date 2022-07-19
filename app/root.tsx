import type {
  MetaFunction,
  LoaderFunction,
  LinksFunction
} from "@remix-run/node";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useFetcher
} from "@remix-run/react";
import { useEffect } from "react";

import supabase from "./api/supabase";
import styles from './tailwind.css'

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async () => {
  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY
    }
  }
}

export default function App() {
  const { env } = useLoaderData()
  const fetcher = useFetcher()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('signing in')
        fetcher.submit({
          accessToken: session?.access_token!
        }, {
          method: 'post',
          action: '/login'
        })
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />

        <script dangerouslySetInnerHTML={{
          __html: `window.env = ${JSON.stringify(env)}`
        }} />


        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
