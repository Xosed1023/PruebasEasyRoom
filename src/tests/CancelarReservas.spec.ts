import { test } from "@playwright/test"

const opciones = [
    { nombre: "Problemas de mantenimiento en el hotel", comentario: false },
    { nombre: "Problemas con el personal del hotel", comentario: false },
    { nombre: "Detalles de limpieza en la habitación", comentario: false },
    { nombre: "Otro", comentario: true },
]

for (const opcion of opciones) {
    test(`Cancelar Reserva con la opción: ${opcion.nombre}`, async ({ page }) => {
        await page.goto("https://test.easyroom.io/")
        await page.getByTestId("email").fill("adminReplicaVsur@easyroom.io")
        await page.getByTestId("password").fill("ABCd1234")
        await page.getByRole("button", { name: "Ingresar" }).click()

        await page
            .locator("div")
            .filter({ hasText: /^Reservaciones$/ })
            .click()

        const reservaCell = await page.getByRole("cell", { name: /prueba unitaria \d+/ }).first()
        const reservaText = await reservaCell.textContent()
        const reservaIdMatch = reservaText?.match(/\d+/)
        const reservaId = reservaIdMatch ? reservaIdMatch[0] : "0000"

        const reservaRow = reservaCell.locator("..")
        const estadoCell = await reservaRow.getByRole("cell", { name: /Pagada|Pendiente|Cancelada/ }).textContent()

        if (estadoCell?.includes("Cancelada")) {
            test.skip(true, `Reserva ${reservaId} ya está cancelada, no se puede volver a cancelar`)
        }

        await reservaCell.click()
        await page.locator(".drawer__menu-button").click()
        await page.getByText("Cancelar reserva").click()

        await page
            .locator("div")
            .filter({ hasText: /^Selecciona una opción$/ })
            .nth(1)
            .click()
        await page.getByText(opcion.nombre).click()

        if (opcion.comentario) {
            const comentario = `Comentario de prueba unitaria: cancelación de reserva ${reservaId}`
            await page.getByRole("textbox", { name: "Escribe un comentario" }).fill(comentario)
        }

        await page.getByRole("button", { name: "Cancelar reserva" }).click()

        await page.locator(".BgBlur.BgBlur--state--open").click()
        await page.getByText("Cancelada").first().waitFor({ state: "visible" })
        const nuevoEstado = await reservaRow.getByRole("cell", { name: "Cancelada" }).textContent()
        expect(nuevoEstado).toContain("Cancelada")
    })
}
