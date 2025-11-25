import { expect, Page } from "@playwright/test"

export async function abrirModuloIncidencias(page: Page) {
    await page.locator(".header__options__icon").click()
    await page.locator("div", { hasText: /^Incidencias$/ }).click()
    await page.locator(".incidencias__float-button").click()
    await expect(page.getByRole("heading", { name: /Registro de incidencia/i })).toBeVisible()
}

export async function abrirModuloIncidenciasLista(page: Page) {
    await page.locator(".header__options__icon").click()
    await page.locator("div", { hasText: /^Incidencias$/ }).click()
    await expect(page.getByText(/Todas las incidencias/i)).toBeVisible({ timeout: 10000 })
}

export async function seleccionarFecha(page: Page) {
    await page.locator("div").filter({ hasText: /^2$/ }).nth(1).click()
}

export async function seleccionarTurno(page: Page, turno = "Matutino") {
    await page
        .locator("div", { hasText: /^TurnoSelecciona una opción$/ })
        .locator("div")
        .nth(2)
        .click()
    await page.getByRole("main").getByText(turno).click()
}

export async function seleccionarColaborador(page: Page) {
    await page.getByRole("textbox", { name: /Agrega el nombre del personal/i }).click()

    const opciones = page.locator('[role="option"], li, div[role="listitem"]')

    await expect(opciones.first()).toBeVisible({ timeout: 10000 })

    const total = await opciones.count()
    if (total === 0) {
        throw new Error("❌ No hay opciones en el dropdown (API rota o sin colaboradores).")
    }

    for (let i = 0; i < total; i++) {
        const texto = (await opciones.nth(i).innerText()).trim()

        if (texto && texto !== "-" && texto !== "—" && texto.length > 1) {
            await opciones.nth(i).click()
            return
        }
    }

    throw new Error("❌ Las opciones disponibles no representan colaboradores válidos.")
}


export async function seleccionarLugar(page: Page, lugar: "Habitación" | "Instalaciones" | "Huésped") {
    await page.getByText(lugar, { exact: true }).click()
}

export async function seleccionarTipoIncidencia(page: Page, tipo: string) {
    await page
        .locator("div")
        .filter({ hasText: /^Selecciona una opción$/ })
        .nth(1)
        .click()
    await page.getByRole("main").getByText(tipo).click()
}

export async function seleccionarHabitacion(page: Page, nombre = "Junior Suite - 606") {
    await page.getByRole("textbox", { name: /Escribe una habitación/i }).click()
    await page.waitForSelector("text=Junior Suite", { timeout: 10000 })
    const opcion = page.getByText(nombre, { exact: true }).first()
    if (await opcion.count()) await opcion.click()
    else await page.locator("text=Suite").first().click()
    await expect(page.getByRole("textbox", { name: /Escribe una habitación/i })).not.toHaveValue("")
}

export async function llenarDetalle(
    page: Page,
    nombreHuesped = "prueba huésped",
    urgencia: "Baja" | "Media" | "Alta" = "Media",
    detalle = "prueba incidencia"
) {
    await page.getByRole("textbox", { name: /Nombre del huésped/i }).fill(nombreHuesped)

    if (urgencia !== "Baja") {
        await page.getByText(new RegExp(`^${urgencia}$`, "i")).click()
    }
    await page.getByRole("textbox", { name: /detalle de la incidencia/i }).fill(detalle)
}

export async function crearYValidar(page: Page) {
    await page.getByRole("button", { name: /Crear incidencia/i }).click()
    await expect(page.getByText("Incidencia creada")).toBeVisible({ timeout: 10000 })
}

export async function seleccionarColaboradorCierre(page: Page, nombre = "Abel Dominguez Martinez") {
    await page.getByRole("textbox", { name: /Escribe un nombre/i }).click()
    await page.waitForSelector('[role="option"], li, div[role="listitem"]', { state: "visible", timeout: 10000 })
    const opcion = page.getByText(nombre, { exact: true }).first()

    if (await opcion.count()) {
        await opcion.click()
    } else {
        await page.locator('[role="option"], li, div[role="listitem"]').first().click()
    }
}
