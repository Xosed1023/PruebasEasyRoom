import { test } from "@playwright/test"
import { abrirRoomService } from "../helpers"
import { openDetalleDeCompra } from "./helpers/hooks"
import {
    handleSelectEstadoOrden,
    handleSelectHabitacion,
    handleSelectMetodoPago,
    handleSelectPersonalEntrega,
    handleSelectTipoPago,
    handleSetInputCard,
    handleSubmit,
} from "./helpers/form"

export const roles = ["recepcion", "administracion", "roomservice"]

for (const rol of roles) {
    test.describe(` Rol: ${rol} - Detalle de Compra - Habitación`, () => {
        test.beforeEach(async ({ page }) => {
            await abrirRoomService(page, rol)
        })

        test("Detalle de Compra - Pago pendiente - Orden entregada", async ({ page }) => {
            await openDetalleDeCompra(page)
            await handleSelectHabitacion(page, "Junior Villa 6")
            await handleSubmit(page)
            await handleSelectEstadoOrden(page, "entregada")
        })

        test("Detalle de Compra - Pago pendiente - Orden prepararda", async ({ page }) => {
            await openDetalleDeCompra(page)
            await handleSelectHabitacion(page, "Junior Villa 6")
            await handleSubmit(page)
            await handleSelectEstadoOrden(page, "preparada")
        })

        test("Detalle de Compra - Pago total (Efectivo) - Orden entregada", async ({ page }) => {
            await openDetalleDeCompra(page)
            await handleSelectHabitacion(page, "Junior Villa 6")
            await handleSelectTipoPago(page, "Total")
            await handleSelectMetodoPago(page, "Efectivo")
            await handleSelectPersonalEntrega(page, "Brenda Kaoly Pechi Perez")
            await handleSubmit(page)
            await handleSelectEstadoOrden(page, "entregada")
        })

        test("Detalle de Compra - Pago total (Visa o Mastercard 1234) - Orden entregada", async ({ page }) => {
            await openDetalleDeCompra(page)
            await handleSelectHabitacion(page, "Junior Villa 6")
            await handleSelectTipoPago(page, "Total")
            await handleSelectMetodoPago(page, "Visa o Mastercard")
            await handleSetInputCard(page, "1234")
            await handleSelectPersonalEntrega(page, "Brenda Kaoly Pechi Perez")
            await handleSubmit(page)
            await handleSelectEstadoOrden(page, "entregada")
        })

        test("Detalle de Compra - Pago total (AMEX 1678) - Orden preparada", async ({ page }) => {
            await openDetalleDeCompra(page)
            await handleSelectHabitacion(page, "Junior Villa 6")
            await handleSelectTipoPago(page, "Total")
            await handleSelectMetodoPago(page, "AMEX")
            await handleSetInputCard(page, "1678")
            await handleSelectPersonalEntrega(page, "Brenda Kaoly Pechi Perez")
            await handleSubmit(page)
            await handleSelectEstadoOrden(page, "preparada")
        })
    })
}
