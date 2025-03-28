import { test, expect } from '@playwright/test';

test('home page shows welcome message', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  
  // メインナビゲーションのリンクをクリック
  const aboutLink = page.getByRole('link', { name: /about/i });
  await aboutLink.waitFor({ state: 'visible' });
  await aboutLink.click();
  await expect(page).toHaveURL(/.*about/);
  
  // ヘッダーが正しく表示されることを確認
  await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();
});

test('theme switching works', async ({ page }) => {
  await page.goto('/');
  
  // ダークモードボタンをクリック
  const darkModeButton = page.getByRole('button', { name: /dark mode/i });
  await darkModeButton.waitFor({ state: 'visible' });
  await darkModeButton.click();
  
  // bodyタグにダークモードのクラスが追加されることを確認
  await expect(page.locator('body')).toHaveClass(/dark/);
}, { timeout: 60000 });

test('language switching works', async ({ page }) => {
  await page.goto('/');
  
  // 言語切り替えボタンをクリック
  const languageButton = page.getByRole('button', { name: /language/i });
  await languageButton.waitFor({ state: 'visible' });
  await languageButton.click();
  
  const japaneseMenuItem = page.getByRole('menuitem', { name: /日本語/i });
  await japaneseMenuItem.waitFor({ state: 'visible' });
  await japaneseMenuItem.click();
  
  // URLに言語コードが含まれることを確認
  await expect(page).toHaveURL(/.*\?lang=ja/);
}, { timeout: 60000 }); 