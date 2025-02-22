import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const subscription = await request.json();
	
	// ここでサブスクリプション情報をデータベースに保存するなどの処理を実装
	console.log('Received push subscription:', subscription);

	return json({ success: true });
}; 