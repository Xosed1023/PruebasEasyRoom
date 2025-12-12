import { Page } from "@playwright/test"

async function handleSelectHabitacion(page: Page, value: string) {
    await page
        .locator("div")
        .filter({ hasText: /^Habitación$/ })
        .click()
    await page.getByTestId("detalle-compra-rooms").click()
    await page.getByText(value).click()
}

const handleSubmit = (page: Page) => page.getByRole("button", { name: "Crear orden" }).click()

const handleSelectEstadoOrden = async (page: Page, estado: "entregada" | "preparada" = "entregada") => {
    if (estado === "entregada") {
        await page
            .locator("div")
            .filter({ hasText: /^Entregar ordenLa orden será entregada al huésped en este momento$/ })
            .first()
            .click()
    } else {
        await page
            .locator("div")
            .filter({ hasText: /^Preparar ordenLa orden se enviará al módulo de preparación$/ })
            .first()
            .click()
    }
}

async function handleSelectPersonalEntrega(page: Page, value: string) {
    await page.getByTestId("detalle-compra__input-colaborador").click()
    await page.getByText(value).click()
}

async function handleSelectTipoPago(page: Page, value: "Total" | "Parcial" | "Pendiente" = "Total") {
    await page.getByTestId("detalle-compra-tipo-pago").click()
    await page.getByTestId("detalle-compra-tipo-pago__drop").getByText(value).click()
}

async function handleSelectMetodoPago(
    page: Page,
    value:
        | "Efectivo"
        | "Visa o Mastercard"
        | "AMEX"
        | "Love points"
        | "Cortesía"
        | "Consumo interno"
        | "Depósito/Transfer" = "Efectivo"
) {
    await page.getByTestId("detalle-compra-metodo-pago").click()
    await page.getByText(value).click()
}

async function handleSetInputCard(page: Page, value: string) {
    await page.getByTestId("detalle-compra-input-card").click()
    await page.getByTestId("detalle-compra-input-card").fill(value)
}

async function handleSetInputPersonalConsumoInterno(page: Page, value: string) {
    await page.getByTestId("detalle-compra__input-personal-consumo-interno").click()
    await page.getByText(value).click() // "Eugenio Escobedo García"
}

async function handleUpdateInputCantidadProducto(page: Page, value: number, row: number) {
    const id = `detalle-compra__input-number__${row}`
    await page.getByTestId(id).click()
    await page.getByTestId(id).fill(`${value}`)
}

async function handleSetPropina(page: Page, type: "10%" | "15%" | "Otro monto" = "10%", value?: string) {
    if (type === "Otro monto" && value) {
        await page.getByTestId("tip-section__Otro monto").click()
        await page.getByTestId("tip-section__input-currency").click()
        await page.getByTestId("tip-section__input-currency").fill(value)
    } else {
        await page.getByTestId(`tip-section__${value}`).click()
    }
}

async function removeProduct(page: Page) {
    await page.getByTestId("detalle-compra__remove__1").click()
}

export {
    handleSelectHabitacion,
    handleSubmit,
    handleSelectEstadoOrden,
    handleSelectPersonalEntrega,
    handleSelectTipoPago,
    handleSelectMetodoPago,
    handleSetInputCard,
    handleSetPropina,
    handleUpdateInputCantidadProducto,
    removeProduct,
    handleSetInputPersonalConsumoInterno,
}
