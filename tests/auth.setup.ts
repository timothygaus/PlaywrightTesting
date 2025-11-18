import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/standard-user.json'

setup('log in as standard user', async ({ page }) => {
    await page.goto('/')

    await page.getByPlaceholder('Username').fill('standard_user')
    await page.getByPlaceholder('Password').fill('secret_sauce')
    await page.getByRole('button', { name: /login/i}).click()

    await expect(page).toHaveURL(/.*inventory/)

    const cookies = await page.context().cookies()

    await page.context().storageState({ path: authFile })
})