import { Page } from "@playwright/test"

export const metodos = ["efectivo", "visa", "amex", "deposito", "consumoInterno", "cortesia"]

export async function metodoPago(page: Page, tipo: string) {
    await page
        .locator("div")
        .filter({ hasText: /^Selecciona una opción$/ })
        .first()
        .click()

    switch (tipo) {
        // EFECTIVO
        case "efectivo":
            await page.getByText("Efectivo").click()
            break
        case "efectivo_easyRewards":
            await page.getByText("Efectivo").click()
            await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).fill("29407")
            break
        case "efectivo_propina10":
            await page.getByText("Efectivo").click()
            await page.getByText("10%").click()
            break
        case "efectivo_propina15":
            await page.getByText("Efectivo").click()
            await page.getByText("15%").click()
            break
        case "efectivo_propinaOtro":
            await page.getByText("Efectivo").click()
            await page
                .locator("div")
                .filter({ hasText: /^Otro monto$/ })
                .click()
            await page.getByRole("textbox", { name: "Ingresa el monto" }).fill("10")
            break
        case "efectivo_easyRewards_propina10":
            await page.getByText("Efectivo").click()
            await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).fill("29407")
            await page.getByText("10%").click()
            break

        // VISA / MASTERCARD
        case "visa":
            await page.getByText("Visa o Mastercard").click()
            await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("1234567890")
            break
        case "visa_easyRewards":
            await page.getByText("Visa o Mastercard").click()
            await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("1234567890")
            await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).fill("29407")
            break
        case "visa_propina10":
            await page.getByText("Visa o Mastercard").click()
            await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("1234567890")
            await page.getByText("10%").click()
            break
        case "visa_propina15":
            await page.getByText("Visa o Mastercard").click()
            await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("1234567890")
            await page.getByText("15%").click()
            break
        case "visa_propinaOtro":
            await page.getByText("Visa o Mastercard").click()
            await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("1234567890")
            await page
                .locator("div")
                .filter({ hasText: /^Otro monto$/ })
                .click()
            await page.getByRole("textbox", { name: "Ingresa el monto" }).fill("10")
            break
        case "visa_easyRewards_propina10":
            await page.getByText("Visa o Mastercard").click()
            await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("1234567890")
            await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).fill("29407")
            await page.getByText("10%").click()
            break

        // AMEX
        case "amex":
            await page.getByText("Amex").click()
            await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("1234567890")
            break
        case "amex_easyRewards":
            await page.getByText("Amex").click()
            await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("1234567890")
            await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).fill("29407")
            break
        case "amex_propina10":
            await page.getByText("Amex").click()
            await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("1234567890")
            await page.getByText("10%").click()
            break
        case "amex_propina15":
            await page.getByText("Amex").click()
            await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("1234567890")
            await page.getByText("15%").click()
            break
        case "amex_propinaOtro":
            await page.getByText("Amex").click()
            await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("1234567890")
            await page
                .locator("div")
                .filter({ hasText: /^Otro monto$/ })
                .click()
            await page.getByRole("textbox", { name: "Ingresa el monto" }).fill("10")
            break
        case "amex_easyRewards_propina10":
            await page.getByText("Amex").click()
            await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("1234567890")
            await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).fill("29407")
            await page.getByText("10%").click()
            break

        // DEPÓSITO / TRANSFERENCIA
        case "deposito":
            await page.getByText("Depósito/Transfer").click()
            await page.getByRole("textbox", { name: "Ingresa número" }).fill("1234567890")
            break
        case "deposito_easyRewards":
            await page.getByText("Depósito/Transfer").click()
            await page.getByRole("textbox", { name: "Ingresa número" }).fill("1234567890")
            await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).fill("29407")
            break
        case "deposito_propina10":
            await page.getByText("Depósito/Transfer").click()
            await page.getByRole("textbox", { name: "Ingresa número" }).fill("1234567890")
            await page.getByText("10%").click()
            break
        case "deposito_propina15":
            await page.getByText("Depósito/Transfer").click()
            await page.getByRole("textbox", { name: "Ingresa número" }).fill("1234567890")
            await page.getByText("15%").click()
            break
        case "deposito_propinaOtro":
            await page.getByText("Depósito/Transfer").click()
            await page.getByRole("textbox", { name: "Ingresa número" }).fill("1234567890")
            await page
                .locator("div")
                .filter({ hasText: /^Otro monto$/ })
                .click()
            await page.getByRole("textbox", { name: "Ingresa el monto" }).fill("10")
            break
        case "deposito_easyRewards_propina10":
            await page.getByText("Depósito/Transfer").click()
            await page.getByRole("textbox", { name: "Ingresa número" }).fill("1234567890")
            await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).fill("29407")
            await page.getByText("10%").click()
            break

        // CONSUMO INTERNO
        case "consumo":
            await page.getByText("Consumo interno").click()
            break

        // CORTESÍA
        case "cortesia":
            await page.getByText("Cortesía").click()
            break

        default:
            throw new Error(`Método de pago no soportado: ${tipo}`)
    }
}
