import { test, expect } from '@playwright/test'

test('check for input fields', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByTestId('login-button')).toBeVisible()
})