import { vi } from 'vitest';
import dotenv from 'dotenv';

// テスト環境変数の読み込み
dotenv.config({ path: '.env.test' });

// 環境変数のモック
vi.mock('$env/static/private', () => ({
  JWT_SECRET: 'test-secret-key-for-development-only'
})); 