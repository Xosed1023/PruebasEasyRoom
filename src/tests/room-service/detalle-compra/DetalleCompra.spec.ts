import { test } from "@playwright/test"
import { abrirRoomService } from "../helpers"
import { openDetalleDeCompra } from "./helpers/hooks"
import { handleVisibleTotal } from "./helpers/ticket"

export const roles = ["recepcion", "administracion", "roomservice"]

for (const rol of roles) {
    test.describe(` Rol: ${rol} - Detalle de Compra`, () => {
        test.beforeEach(async ({ page }) => {
            await abrirRoomService(page, rol)
            await openDetalleDeCompra(page)
        })

        test("Detalle de Compra - Regresar", async ({ page }) => {
            await page.getByText("Regresar").click()
        })

        test("Detalle de Compra - Total", async ({ page }) => {
            await handleVisibleTotal(page, "200")
        })
    })
}
