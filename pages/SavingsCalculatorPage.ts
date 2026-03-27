import { expect, Locator, Page } from "@playwright/test";

export enum CompoundFrequency {
    Daily = 'Daily',
    Monthly = 'Monthly',
    Quarterly = 'Quarterly',
    Annually = 'Annually',
}

export enum ContributionFrequency {
    SemiMonthly = 'Semi-Monthly',
    Monthly = 'Monthly',
    Annually = 'Annually',
}

export class SavingsCalculatorPage {
    readonly page: Page

    // Inputs
    readonly startingBalanceInput: Locator
    readonly apyInput: Locator
    readonly compoundFrequencyDropdown: Locator
    readonly additionalContributionInput: Locator
    readonly contributionFrequencyDropdown: Locator
    readonly yearsToSaveInput: Locator

    // Actions
    readonly calculateButton: Locator
    readonly compareSavingsRatesToggle: Locator

    // Outputs
    readonly savingsBalanceResult: Locator

    // Errors
    readonly startingBalanceError: Locator
    readonly apyError: Locator
    readonly additionalContributionError: Locator
    readonly yearsToSaveError: Locator

    constructor(page: Page) {
        this.page = page

        this.startingBalanceInput = page.getByLabel('Starting Balance')
        this.apyInput = page.getByLabel('Annual Percentage Yield')
        this.compoundFrequencyDropdown = page.getByLabel('Compound Frequency')
        this.additionalContributionInput = page.getByLabel('Additional Contribution')
        this.contributionFrequencyDropdown = page.getByLabel('Contribution Frequency')
        this.yearsToSaveInput = page.getByLabel('Years to Save')
        this.calculateButton = page.getByRole('button', { name: 'Calculate' })
        this.compareSavingsRatesToggle = page.getByLabel('Compare Savings Rates')
        this.savingsBalanceResult = page.locator('[class*="resultValue"]')

        this.startingBalanceError = page.getByLabel('Starting Balance').locator('..').locator('[class*="CalculatorInputField_error"]')
        this.apyError = page.getByLabel('Annual Percentage Yield').locator('..').locator('[class*="CalculatorInputField_error"]')
        this.additionalContributionError = page.getByLabel('Additional Contribution').locator('..').locator('[class*="CalculatorInputField_error"]')
        this.yearsToSaveError = page.getByLabel('Years to Save').locator('..').locator('[class*="CalculatorInputField_error"]')
    }

    async goto() {
        await this.page.goto('/checking-account/savings-calculator')
    }

    async fillStartingBalance(amount: string) {
        await this.startingBalanceInput.clear()
        await this.startingBalanceInput.fill(amount)
    }

    async fillApy(rate: string) {
        await this.apyInput.clear()
        await this.apyInput.fill(rate)
    }

    async selectCompoundFrequency(frequency: CompoundFrequency) {
        await this.compoundFrequencyDropdown.selectOption(frequency)
    }

    async fillAdditionalContribution(amount: string) {
        await this.additionalContributionInput.clear()
        await this.additionalContributionInput.fill(amount)
    }

    async selectContributionFrequency(frequency: ContributionFrequency) {
        await this.contributionFrequencyDropdown.selectOption(frequency)
    }

    async fillYearsToSave(years: string) {
        await this.yearsToSaveInput.clear()
        await this.yearsToSaveInput.fill(years)
    }

    async clickCalculateButton() {
        await this.calculateButton.click()
    }

    async getSavingsBalance(): Promise<string> {
        await expect(this.savingsBalanceResult).not.toHaveText('$--')
        return await this.savingsBalanceResult.innerText()
    }

    async getSavingsBalanceAsNumber(): Promise<number> {
        const text = await this.getSavingsBalance()
        return parseFloat(text.replace(/[$,]/g, ''))
    }
}