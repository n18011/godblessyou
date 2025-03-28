import { test, expect } from '@playwright/test';

test('home page shows welcome message', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
});

test('navigation works', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  
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
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  
  // ダークモードボタンを探して待機
  const darkModeButton = page.getByTestId('theme-toggle');
  await expect(darkModeButton).toBeVisible({ timeout: 10000 });
  
  // ボタンの初期状態を確認
  await expect(darkModeButton).toContainText('Dark Mode');
  
  // ボタンをクリック
  await darkModeButton.click();
  
  // bodyタグにダークモードのクラスが追加されることを確認
  await expect(page.locator('body')).toHaveClass(/dark/);
});

test('language switching works', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  
  // 言語切り替えボタンを探して待機
  const languageButton = page.getByTestId('language-toggle');
  await expect(languageButton).toBeVisible({ timeout: 10000 });
  
  // ボタンの初期状態を確認
  await expect(languageButton).toContainText('Language');
  
  // ボタンをクリック
  await languageButton.click();
  
  // 日本語メニュー項目を探して待機
  const japaneseMenuItem = page.getByTestId('language-ja');
  await expect(japaneseMenuItem).toBeVisible({ timeout: 5000 });
  
  // メニュー項目をクリック
  await japaneseMenuItem.click();
  
  // URLに言語コードが含まれることを確認
  await expect(page).toHaveURL(/.*\?lang=ja/);
}); 