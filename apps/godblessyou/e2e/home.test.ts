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
  const darkModeButton = page.getByTestId('theme-toggle');
  await darkModeButton.waitFor({ state: 'visible', timeout: 5000 });
  await darkModeButton.click();
  
  // bodyタグにダークモードのクラスが追加されることを確認
  await expect(page.locator('body')).toHaveClass(/dark/);
});

test('language switching works', async ({ page }) => {
  await page.goto('/');
  
  // 言語切り替えボタンをクリック
  const languageButton = page.getByTestId('language-toggle');
  await languageButton.waitFor({ state: 'visible', timeout: 5000 });
  await languageButton.click();
  
  // 日本語メニュー項目をクリック
  const japaneseMenuItem = page.getByTestId('language-ja');
  await japaneseMenuItem.waitFor({ state: 'visible', timeout: 5000 });
  await japaneseMenuItem.click();
  
  // URLに言語コードが含まれることを確認
  await expect(page).toHaveURL(/.*\?lang=ja/);
}); 