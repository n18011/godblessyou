import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 環境変数のモック
vi.stubEnv('VITE_VAPID_PUBLIC_KEY', 'test_public_key');
vi.stubEnv('VITE_VAPID_PRIVATE_KEY', 'test_private_key');
vi.stubEnv('VITE_CONTACT_EMAIL', 'test@example.com'); 