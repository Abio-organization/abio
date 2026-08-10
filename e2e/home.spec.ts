import { expect, test } from '@playwright/test'

test('home page loads and links to sign in', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Abio' })).toBeVisible()

  await page.getByRole('link', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/auth\/sign-in$/)
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
})
