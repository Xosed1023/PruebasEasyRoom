import { test } from "@playwright/test"
import { abrirRoomService } from "../helpers"
import { openDetalleDeCompra } from "./helpers/hooks"
import { handleSelectEstadoOrden, handleSelectPersonalEntrega, handleSubmit } from "./helpers/form"

export const roles = ["recepcion", "administracion", "roomservice"]

for (const rol of roles) {
    test.describe(` Rol: ${rol} - Detalle de Compra - Mostrador`, () => {
        test.beforeEach(async ({ page }) => {
            await abrirRoomService(page, rol)
        })

        test("Detalle de Compra - Pago total (Efectivo) - Orden entregada", async ({ page }) => {
            await openDetalleDeCompra(page)
            await handleSelectPersonalEntrega(page, "Brenda Kaoly Pechi Perez")
            await handleSubmit(page)
            await handleSelectEstadoOrden(page, "entregada")
        })
    })
}
