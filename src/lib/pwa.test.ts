import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { registerServiceWorker } from './pwa.js';

describe('PWA機能のテスト', () => {
  beforeEach(() => {
    // Service Worker APIのモックをより完全な形で実装
    vi.stubGlobal('navigator', {
      serviceWorker: {
        register: vi.fn(),
        ready: Promise.resolve({
          pushManager: {
            subscribe: vi.fn()
          }
        })
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('Service Worker登録', () => {
    it('Service Workerが正常に登録されること', async () => {
      const mockRegistration = {
        pushManager: {
          subscribe: vi.fn().mockResolvedValue({})
        }
      };
      
      // モック関数の型アサーション追加
      (navigator.serviceWorker.register as unknown as ReturnType<typeof vi.fn>)
        .mockResolvedValue(mockRegistration);
      
      const registration = await registerServiceWorker();
      
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
      expect(registration).toBe(mockRegistration);
    });

    it('Service Worker登録に失敗した場合エラーハンドリングされること', async () => {
      // コンソールエラーの出力を抑制
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const expectedError = new Error('Registration failed');
      
      // モック関数の型アサーション追加
      (navigator.serviceWorker.register as unknown as ReturnType<typeof vi.fn>)
        .mockRejectedValue(expectedError);
      
      const result = await registerServiceWorker();
      
      // 戻り値の確認
      expect(result).toBeNull();
      
      // コンソール出力の確認を実装に合わせる
      expect(consoleError).toHaveBeenCalledWith('Service Worker registration failed:', expectedError);
      
      // モックをリストア
      consoleError.mockRestore();
    });
  });
}); 