import { test, expect } from "@playwright/test"
import { login } from "./helpers/auth"

test.describe("Estatus de órdenes", () => {
    test.beforeEach(async ({ page }) => {
        await login(page, "administracion")
        await page.waitForLoadState("networkidle")

        // Room Service
        const seccionModulos = page
            .locator("section")
            .filter({ hasText: /^Reservaciones\s*Personal\s*Room Service\s*Restaurante$/ })
        await expect(seccionModulos).toBeVisible()
        await seccionModulos.click()

        // Elegir "Room Service"
        const roomServiceCard = page.locator("div").filter({ hasText: /^Room Service$/ })
        await expect(roomServiceCard).toBeVisible()
        await roomServiceCard.click()

        // Botón "Estatus de órdenes"
        await page.getByRole("button", { name: /estatus de órdenes/i }).click()

        // Verificar título de Órdenes
        await expect(page.getByRole("heading", { name: /^Órdenes$/ })).toBeVisible()
        await page.waitForLoadState("networkidle")

        // Espera a que la tabla esté visible
        const tabla = page.getByTestId("ordenes-table").or(page.locator(".ordenes__table"))
        await expect(tabla).toBeVisible({ timeout: 15000 })
    })

    //ENTREGADA
    test("Entregada", async ({ page }) => {
        await page.getByText("Entregada").first().click()
        await page.getByText("Por pagar").click()
        await page.locator("span").filter({ hasText: "$0" }).click()
        await page.getByRole("button", { name: "Cancelar orden" }).click()
        await page.getByRole("heading", { name: "Cancelación de orden" }).click()
        await page.getByText("Productos").click()
        await page.getByRole("cell", { name: "Devolución a inventario" }).locator("span").click()
        await page.locator(".switch").first().click()
        await page.getByText("Motivo de cancelación").click()
        await page.getByText("Motivo", { exact: true }).click()
        await page.getByRole("main").getByRole("img").nth(3).click()
        await page.getByText("Producto dañado").click()
        await page.getByRole("button", { name: "Procesar cancelación" }).click()
        await page.getByText("Comanda cancelada").click()
    })
    //EN ENTREGA
    test("En entrega", async ({ page }) => {
        await page.getByText("En entrega").first().click()
        await page
            .locator("div")
            .filter({ hasText: /^En entrega$/ })
            .click()
        await page.getByRole("button", { name: "Editar orden" }).click()
        await expect(page.getByRole("heading", { name: /Edición de orden -/ })).toBeVisible()
        // await page.getByText("AlimentosBebidasEntradas").click()
        // await page.getByText("99EVENTO BEBIDASEVENTO BEBIDAS- 100 Pz$1,0000").click()
        // await page.locator("svg:nth-child(3) > path").first().click()
        // await page.locator("svg:nth-child(3)").first().click()
        await page.getByRole("button", { name: "Continuar" }).click()
        await page.getByRole("button", { name: "Actualizar orden" }).click()
        await page.getByRole("button", { name: "Pagar orden" }).click()
        await page.getByRole("heading", { name: "Pagos pendientes" }).click()
        await page.getByText("Método de pago").first().click()
        await page
            .locator("div")
            .filter({ hasText: /^Selecciona una opción$/ })
            .nth(1)
            .click()
        await page.getByText("Efectivo").click()
        await page.getByText("¿Quién atendió el servicio?").click()
        await page.getByRole("button", { name: "Pagar" }).click()
        await page.getByText("Pago registrado").click()
        await page.getByText("Por pagar").click()
        await page.locator("span").filter({ hasText: "$0" }).first()
        await page.locator(".drawer__close-button > path").click()
    })

    //EN SERVICIO
    test("En servicio", async ({ page }) => {
        await page.getByText("En servicio").first().click()
        await page.getByText("Pendiente de pago").click()
        await page.getByText("Total pagado").click()
        await page.getByRole("button", { name: "Pagar orden" }).click()
        await page.getByText("Área cerrada").click()
        await page
            .locator("div")
            .filter({ hasText: /^Comandas$/ })
            .click()
        await page.getByText("Pago", { exact: true }).click()
        await page.getByText("Método de pago").first().click()
        await page
            .locator("div")
            .filter({ hasText: /^Selecciona una opción$/ })
            .nth(1)
            .click()
        await page.getByText("Efectivo").click()

        await page.getByText("¿Quién entregará la orden?").click()
        await page.getByRole("button", { name: "Pagar cuenta" }).click()
        await page.getByText("Área cerrada").click()
        await page.locator(".drawer__close-button > path").click()
    })

    //EN PREPARACIÓN
    test("En preparacion", async ({ page }) => {
        await page.getByText("En preparación").first().click()
        await page.getByText("Orden en preparación").click()
        await page.getByRole("paragraph").filter({ hasText: "Fecha y hora de venta" }).click()

        await page.getByText("Por pagar").click()

        const ceroSpan = page.locator("span").filter({ hasText: "$0" }).first()
        const esCero = await ceroSpan.isVisible().catch(() => false)

        if (esCero) {
            await page.locator(".drawer__close-button > path").click()
        } else {
            await page.getByRole("button", { name: "Pagar orden" }).click()
            await page
                .locator("div")
                .filter({ hasText: /^Pago$/ })
                .click()
            await page.getByText("Método de pago").first().click()
            await page
                .locator("div")
                .filter({ hasText: /^PagoMétodo de pagoSelecciona una opción$/ })
                .getByRole("img")
                .nth(1)
                .click()
            await page.getByText("Efectivo").click()
            await page.getByText("¿Quién atendió el servicio?").click()
            await page.getByRole("textbox", { name: "Busca el nombre del personal" }).click()
            const colaborador = page.locator(".input-personal__item").first()
            await colaborador.waitFor({ state: "visible", timeout: 5000 })
            await colaborador.click()
            await page.getByRole("button", { name: "Pagar" }).click()
            await page.getByText("Pago registrado").click()
            await page.locator(".drawer__close-button > path").click()
        }
    })

    //CANCELADA
    test("cancelada", async ({ page }) => {
        await page.getByText("Cancelada").first().click()
        await page.getByText("Orden pagada y cancelada").click()
        await page.getByText("Motivo de cancelación:").click()
        await page.getByRole("main").getByText("Total").nth(1).click()
        await page.locator(".drawer__close-button").click()
    })

    //POR ENTREGAR
    test("Por entregar", async ({ page }) => {
        await page.getByText("Por entregar").first().click()
        await page.getByText("Orden por entregar").click()
        await page.getByRole("paragraph").filter({ hasText: "Fecha y hora de venta" }).click()
        await page.getByText("Orden procesada por").click()
        await page.getByText("Productos de la orden").click()
        await page.getByText("Por pagar").click()

        const ceroSpan = page.locator("span").filter({ hasText: "$0" }).first()
        const esCero = await ceroSpan.isVisible().catch(() => false)

        if (esCero) {
            await page.locator(".drawer__close-button > path").click()
        } else {
            await page.getByRole("button", { name: "Pagar orden" }).click()
            await page
                .locator("div")
                .filter({ hasText: /^Pago$/ })
                .click()
            await page.getByText("Método de pago").first().click()
            await page
                .locator("div")
                .filter({ hasText: /^PagoMétodo de pagoSelecciona una opción$/ })
                .getByRole("img")
                .nth(1)
                .click()
            await page.getByText("Efectivo").click()
            await page.getByText("¿Quién atendió el servicio?").click()
            await page.getByRole("textbox", { name: "Busca el nombre del personal" }).click()
            const colaborador = page.locator(".input-personal__item").first()
            await colaborador.waitFor({ state: "visible", timeout: 5000 })
            await colaborador.click()
            await page.getByRole("button", { name: "Pagar" }).click()
            await page.getByText("Pago registrado").click()
            await page.locator(".drawer__close-button > path").click()
        }
    })
})
