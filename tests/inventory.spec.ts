import { test, expect } from '@playwright/test'

// Use the storage state produced by `tests/auth.setup.ts` for authenticated tests only.
test.use({ storageState: 'playwright/.auth/standard-user.json' })

test('standard user can see inventory', async ({ page }) => {
    await page.goto('/inventory.html')

    const cookies = await page.context().cookies()

    await expect(page).toHaveURL(/.*inventory/)
    await expect(page.getByTestId('title')).toHaveText('Products')
})