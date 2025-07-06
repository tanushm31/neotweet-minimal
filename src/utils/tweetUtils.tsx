export type Tweet = {
  id: string;
  content: string;
  image?: string | null;
  userEmail: string;
  userImage?: string | null;
  createdAt: string;
};

import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchTweets(): Promise<Tweet[]> {
  const { data, error } = await supabase
    .from('tweets')
    .select('*')
    .order('createdAt', { ascending: false });
  if (error) return [];
  return data as Tweet[];
}

export async function postTweet({ content, image }: { content: string; image?: string | null; }): Promise<Tweet> {
  const { data, error } = await supabase
    .from('tweets')
    .insert([{ content, image, userEmail: 'demo@user.com', userImage: '', createdAt: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data as Tweet;
}
