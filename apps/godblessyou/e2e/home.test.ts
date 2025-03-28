import { test, expect } from '@playwright/test';

test('home page shows welcome message', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  
  // メインナビゲーションのリンクをクリック
  await page.getByRole('link', { name: /about/i }).click();
  await expect(page).toHaveURL(/.*about/);
  
  // ヘッダーが正しく表示されることを確認
  await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();
});

test('theme switching works', async ({ page }) => {
  await page.goto('/');
  
  // ダークモードボタンをクリック
  await page.getByRole('button', { name: /dark mode/i }).click();
  
  // bodyタグにダークモードのクラスが追加されることを確認
  await expect(page.locator('body')).toHaveClass(/dark/);
});

test('language switching works', async ({ page }) => {
  await page.goto('/');
  
  // 言語切り替えボタンをクリック
  await page.getByRole('button', { name: /language/i }).click();
  await page.getByRole('menuitem', { name: /日本語/i }).click();
  
  // URLに言語コードが含まれることを確認
  await expect(page).toHaveURL(/.*\?lang=ja/);
}); 