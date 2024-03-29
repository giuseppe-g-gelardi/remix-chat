import supabase from '~/api/supabase';
import { getSession } from '~/api/cookie';
import { redirect } from '@remix-run/node';

export default async (context: any) => {
  const session = await getSession(context.request.headers.get('Cookie'));
  const accessToken = session.get('accessToken');
  const { user } = await supabase.auth.api.getUser(accessToken);
  const result = {
    supabase,
    user,
    accessToken,
    redirect: null as any
  };

  if (!user) {
    result['redirect'] = redirect('/login');
    return result;
  }

  await supabase.auth.setAuth(accessToken);

  return result;
};
