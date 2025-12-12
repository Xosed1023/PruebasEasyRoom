import { Page } from "@playwright/test"

async function handleVisibleTotal(page: Page, value: string) {
    const locator = await page.getByTestId("detalle-compra__ticket__total")

    expect(locator.textContent).toBe(value)
}

async function handleVisiblePorPagar(page: Page, value: string) {
    const locator = await page.getByTestId("detalle-compra__ticket__por-pagar")

    expect(locator.textContent).toBe(value)
}

export { handleVisibleTotal, handleVisiblePorPagar }
