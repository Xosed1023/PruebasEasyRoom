import { test } from "@playwright/test"
import { login } from "../helpers/auth"
import {
    abrirModuloIncidencias,
    abrirModuloIncidenciasLista,
    crearYValidar,
    llenarDetalle,
    seleccionarColaborador,
    seleccionarColaboradorCierre,
    seleccionarFecha,
    seleccionarHabitacion,
    seleccionarLugar,
    seleccionarTipoIncidencia,
    seleccionarTurno,
} from "./helpers"

test.describe("Registro de incidencias - Escenarios principales", () => {
    test.beforeEach(async ({ page }) => {
        await login(page, "administracion")
        await abrirModuloIncidencias(page)
        await seleccionarFecha(page)
        await seleccionarTurno(page)
        await seleccionarColaborador(page)
    })

    test("Incidencia de limpieza en habitación con urgencia media", async ({ page }) => {
        await seleccionarLugar(page, "Habitación")
        await seleccionarTipoIncidencia(page, "Limpieza")
        await seleccionarHabitacion(page)
        await llenarDetalle(page, "Huésped Prueba", "Media", "Limpieza pendiente en baño")
        await crearYValidar(page)
    })

    test("Incidencia en instalaciones con urgencia alta", async ({ page }) => {
        await seleccionarLugar(page, "Instalaciones")
        await seleccionarTipoIncidencia(page, "Mantenimiento")
        await seleccionarLugar(page, "Instalaciones")
        await seleccionarTipoIncidencia(page, "Mantenimiento")
        await llenarDetalle(page, "Mantenimiento", "Alta", "Fuga de agua en cocina principal")
        await crearYValidar(page)
    })

    test("Incidencia reportada por huésped conurgencia baja", async ({ page }) => {
        await seleccionarLugar(page, "Huésped")
        await seleccionarTipoIncidencia(page, "Objeto olvidado")
        await llenarDetalle(page, "Huésped Pérez", "Baja", "Ruido excesivo en habitación vecina")
        await crearYValidar(page)
    })
})

test.describe("Gestión de incidencias abiertas y cerradas", () => {
    test.beforeEach(async ({ page }) => {
        await login(page, "administracion")
        await abrirModuloIncidenciasLista(page)
    })

    test("Cerrar una incidencia activa", async ({ page }) => {
        // Abre la primera incidencia activa
        await page.getByText("Todas las incidencias").click()
        await page.locator("td:nth-child(2)").first().click()
        await page.getByRole("heading", { name: "Detalle de incidencia" }).isVisible()

        // Cerrar incidencia
        await page.getByRole("button", { name: "Cerrar incidencia" }).click()
        await page.getByRole("heading", { name: "Cerrar incidencia" }).isVisible()
        await seleccionarColaboradorCierre(page, "Abel Dominguez Martinez")
        await page.getByRole("textbox", { name: "Escribe algo..." }).fill("pruebas cierre incidencia activa")

        await page.locator("#modal").getByRole("button", { name: "Cerrar incidencia" }).click()
        await page.getByText("Incidencia cerrada").isVisible()
    })

    test("Reabrir una incidencia cerrada", async ({ page }) => {
        await page.getByText("Todas las incidencias").click()
        await page.getByText("Cerradas4").click()
        await page.getByRole("cell", { name: "Cerrada" }).first().click()
        await page.getByRole("heading", { name: "Detalle de incidencia" }).isVisible()

        // Reabrir incidencia
        await page.getByRole("button", { name: "Reabrir incidencia" }).click()

        await page.getByText("Incidencia reabierta").isVisible()
    })
})
