import test, { expect } from "@playwright/test"
import { ContributionFrequency, SavingsCalculatorPage } from "../pages/SavingsCalculatorPage"

test.describe('Savings Calculator', () => {
    let calculatorPage: SavingsCalculatorPage

    test.beforeEach(async ({page}) => {
        calculatorPage = new SavingsCalculatorPage(page)
        await calculatorPage.goto()
    })

    test('displays correct balance with default inputs', async () => {
        // page auto calculates on load, don't need to click calculate
        await expect(calculatorPage.savingsBalanceResult).toHaveText('$19,400')
    })

    test('input custom starting balance, apy, and years saved', async () => {
        await calculatorPage.fillStartingBalance('2500')
        await calculatorPage.fillApy('1')
        await calculatorPage.fillYearsToSave('15')
        await calculatorPage.clickCalculateButton()
        const balance = await calculatorPage.getSavingsBalanceAsNumber()
        expect(balance).toBeCloseTo(22315, -2)
    })

    test('zero starting balance with contributions', async () => {
        await calculatorPage.fillStartingBalance('0')
        await calculatorPage.clickCalculateButton()
        const balance = await calculatorPage.getSavingsBalanceAsNumber()
        expect(balance).toBeCloseTo(13271, -2)
    })

    test('zero apy with contributions', async () => {
        await calculatorPage.fillApy('0')
        await calculatorPage.clickCalculateButton()
        const balance = await calculatorPage.getSavingsBalance()
        expect(balance).toBe('$17,000')
    })

    test('save for only 1 year', async () => {
        await calculatorPage.fillYearsToSave('1')
        await calculatorPage.clickCalculateButton()
        const balance = await calculatorPage.getSavingsBalanceAsNumber()
        expect(balance).toBeCloseTo(6312, -1)
    })

    // BUG: Large savings balance results will overflow the container
    test('all starting inputs at maximum', async () => {
        await calculatorPage.fillStartingBalance('100000000')
        await calculatorPage.fillApy('1000')
        await calculatorPage.fillAdditionalContribution('100000000')
        await calculatorPage.selectContributionFrequency(ContributionFrequency.SemiMonthly)
        await calculatorPage.fillYearsToSave('30')
        await calculatorPage.clickCalculateButton()
        await expect(calculatorPage.savingsBalanceResult).not.toBeEmpty()
    })

    test('all inputs set to zero', async () => {
        await calculatorPage.fillStartingBalance('0')
        await calculatorPage.fillApy('0')
        await calculatorPage.fillAdditionalContribution('0')
        await calculatorPage.clickCalculateButton()
        await expect(calculatorPage.savingsBalanceResult).toHaveText('$--')
    })

    test('maximum boundaries with errors', async () => {
        await calculatorPage.fillStartingBalance('100000001')
        await calculatorPage.fillApy('1001')
        await calculatorPage.fillAdditionalContribution('100000001')
        await calculatorPage.fillYearsToSave('31')

        await expect.soft(calculatorPage.startingBalanceError).toBeVisible()
        await expect.soft(calculatorPage.apyError).toBeVisible()
        await expect.soft(calculatorPage.additionalContributionError).toBeVisible()
        await expect.soft(calculatorPage.yearsToSaveError).toBeVisible()
    })

    test('minimum boundary for years to save', async () => {
        await calculatorPage.fillYearsToSave('0')
        await expect(calculatorPage.yearsToSaveError).toBeVisible()
    })
})