import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { hashPassword } from '$lib/auth/password';
import { createToken } from '$lib/auth/jwt';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, password, name } = await request.json();

    // 入力検証
    if (!email || !password || !name) {
      return json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return json({ error: 'このメールアドレスは既に登録されています' }, { status: 400 });
    }

    // パスワードのハッシュ化
    const passwordHash = await hashPassword(password);

    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'USER'
      }
    });

    // JWTトークンの生成
    const token = createToken(user);

    return json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Registration error:', error);
    return json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}; 