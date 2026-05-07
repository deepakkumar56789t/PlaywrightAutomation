// @ts-check
import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
//   await page.goto('https://demoqa.com/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/demosite/);
// });

test('navigate to demoqa elements and open text box', async ({ page }) => {
  await page.goto('https://demoqa.com/');

  // Click the Elements card on the homepage.
  await page.getByText('Elements', { exact: true }).click();

  // Click the Text Box item in the sidebar.
  await page.getByText('Text Box', { exact: true }).click();

  await expect(page).toHaveURL(/.*text-box/);
});

