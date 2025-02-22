import type { RequestEvent } from '@sveltejs/kit';
import webpush from 'web-push';
import { env } from '$env/dynamic/private';

// 環境変数が存在することを確認
if (!env.VITE_VAPID_PUBLIC_KEY || !env.VITE_VAPID_PRIVATE_KEY || !env.VITE_CONTACT_EMAIL) {
  throw new Error('Required environment variables are missing');
}

// VAPIDの設定を初期化
webpush.setVapidDetails(
  `mailto:${env.VITE_CONTACT_EMAIL}`,
  env.VITE_VAPID_PUBLIC_KEY,
  env.VITE_VAPID_PRIVATE_KEY
);

export async function POST({ request }: RequestEvent) {
  try {
    const subscription = await request.json();
    
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: '通知タイトル',
        body: '通知本文',
      })
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Push notification failed:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 