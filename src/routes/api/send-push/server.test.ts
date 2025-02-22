import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { POST } from './+server.js';
import webpush from 'web-push';

// 環境変数のモックを正しく設定
vi.mock('$env/dynamic/private', () => ({
  env: {
    VITE_VAPID_PUBLIC_KEY: 'test_public_key',
    VITE_VAPID_PRIVATE_KEY: 'test_private_key',
    VITE_CONTACT_EMAIL: 'test@example.com'
  }
}));

// webpushのモックを設定
vi.mock('web-push', () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn()
  }
}));

describe('プッシュ通知送信API', () => {
  let consoleError: any;

  beforeEach(() => {
    // コンソールエラーの出力を抑制
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // テスト後にモックをリストア
    consoleError.mockRestore();
  });

  beforeAll(() => {
    // テスト開始前にVAPIDの設定が行われていることを確認
    expect(webpush.setVapidDetails).toHaveBeenCalledWith(
      'mailto:test@example.com',
      'test_public_key',
      'test_private_key'
    );
  });

  it('プッシュ通知が正常に送信されること', async () => {
    const mockSubscription = {
      endpoint: 'https://test-endpoint.com',
      keys: {
        p256dh: 'test-p256dh',
        auth: 'test-auth'
      }
    };

    const request = new Request('http://localhost/api/send-push', {
      method: 'POST',
      body: JSON.stringify(mockSubscription)
    });

    (webpush.sendNotification as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({});

    const response = await POST({ request, locals: {} } as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
    expect(webpush.sendNotification).toHaveBeenCalledWith(
      mockSubscription,
      expect.any(String)
    );
  });

  it('エラー時に適切なレスポンスを返すこと', async () => {
    const mockSubscription = {
      endpoint: 'https://test-endpoint.com',
      keys: {
        p256dh: 'test-p256dh',
        auth: 'test-auth'
      }
    };

    const request = new Request('http://localhost/api/send-push', {
      method: 'POST',
      body: JSON.stringify(mockSubscription)
    });

    const expectedError = new Error('Push service error');
    (webpush.sendNotification as unknown as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(expectedError);

    const response = await POST({ request, locals: {} } as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Push service error' });
    expect(consoleError).toHaveBeenCalledWith('Push notification failed:', expectedError);
  });
}); 