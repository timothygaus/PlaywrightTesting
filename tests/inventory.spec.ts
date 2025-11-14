import { test, expect } from '@playwright/test'

test('standard user can see inventory', async ({ page }) => {
    await page.goto('/inventory.html')

    const cookies = await page.context().cookies()
    console.log('Cookies in inventory test:', cookies)

    await expect(page).toHaveURL(/.*inventory/)
    await expect(page.getByTestId('title')).toHaveText('Products')
})