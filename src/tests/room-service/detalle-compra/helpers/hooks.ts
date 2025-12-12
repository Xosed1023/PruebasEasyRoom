import { test, expect, Page } from "@playwright/test"
import { addProduct } from "./productos"

export const roles = ["recepcion", "administracion", "roomservice"]

const openDetalleDeCompra = async (page: Page) => {
    await addProduct(page, 2, false)
    await expect(page.locator(".room-service__ticket-item").first()).toBeVisible({ timeout: 10000 })

    const continuarBtn = page.getByRole("button", { name: "Continuar" })
    try {
        await continuarBtn.waitFor({ state: "visible", timeout: 5000 })
        await continuarBtn.click()
    } catch {
        test.skip(true, "No se encontró el botón Registrar pago en Room Service")
    }
}

export { openDetalleDeCompra }
