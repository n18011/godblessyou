import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { POST } from './+server';
import { prisma } from '$lib/server/prisma';
import type { RequestEvent } from '@sveltejs/kit';

describe('POST /api/auth/register', () => {
  beforeAll(async () => {
    // テスト前にデータベースをクリーンアップ
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // テスト後にデータベースをクリーンアップ
    await prisma.user.deleteMany();
  });

  it('新規ユーザーを正常に登録できること', async () => {
    const requestBody = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const response = await POST({ request } as RequestEvent);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.token).toBeDefined();
    expect(data.user).toMatchObject({
      email: requestBody.email,
      name: requestBody.name,
      role: 'USER'
    });
  });

  it('必須項目が不足している場合はエラーを返すこと', async () => {
    const requestBody = {
      email: 'test@example.com',
      // passwordを省略
      name: 'Test User'
    };

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const response = await POST({ request } as RequestEvent);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('必須項目が不足しています');
  });

  it('既存のメールアドレスで登録を試みた場合はエラーを返すこと', async () => {
    // 最初のユーザーを作成
    const user = await prisma.user.create({
      data: {
        email: 'existing@example.com',
        name: 'Existing User',
        passwordHash: 'dummy-hash',
        role: 'USER'
      }
    });

    const requestBody = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const response = await POST({ request } as RequestEvent);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('このメールアドレスは既に登録されています');
  });
}); 