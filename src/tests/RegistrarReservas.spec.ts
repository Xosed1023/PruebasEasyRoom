import { test } from "@playwright/test"
import { login } from "./helpers/auth"
import { metodoPago } from "./helpers/metodosPago"

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)
const dayToday = today.getDate()
const dayNext = tomorrow.getDate()

// Función para seleccionar fechas
async function seleccionarFechas(page) {
    await page
        .locator("div", { hasText: new RegExp(`^${dayToday}$`) })
        .locator(".day__item__dot")
        .click()

    const expected1to28 = Array.from({ length: 28 }, (_, i) => i + 1).join("")
    const allNumberElements = await page.locator("body >> text=/\\d+/").allTextContents()
    let ntdBase = 0
    let calendarText = ""
    for (const text of allNumberElements) {
        const onlyNumbers = text.replace(/\D/g, "")
        if (onlyNumbers.includes(expected1to28)) {
            calendarText = text
            ntdBase = onlyNumbers.startsWith(expected1to28) ? 0 : 2
            break
        }
    }
    const daysArray = calendarText.replace(/\D/g, "").match(/\d+/g)?.map(Number) || []
    const tomorrowIndex = daysArray.indexOf(dayNext)
    await page
        .locator("div")
        .filter({ hasText: RegExp(`^${dayNext}$`) })
        .nth(tomorrowIndex + ntdBase)
        .click()
}

// Función para ingresar al registro de reservas
async function abrirRegistro(page) {
    await page
        .locator("div")
        .filter({ hasText: /^Reservaciones$/ })
        .click()
    await page.locator(".reservas-screen__float-button").click()
}

// Función para reservar habitación
async function reservarHabitacion(
    page,
    habitacion: string,
    tarifaIndex: number,
    tipoPago: "Total" | "Parcial",
    metodo?: string
) {
    const uniqueId = Date.now().toString()
    await page.getByRole("textbox", { name: "Ingresa el código de reserva" }).fill(`11${uniqueId}`)

    const habitacionElement = page.getByText(`${habitacion}2hasta 2 extra`)
    await habitacionElement.waitFor({ state: "visible" })
    await habitacionElement.click()

    const MAX_INTENTOS = 5
    let tarifaSeleccionada = false

    for (let intento = 0; intento < MAX_INTENTOS; intento++) {
        const tarifas = await page
            .locator("div")
            .filter({ hasText: /^Selecciona tipo de tarifa$/ })
            .all()

        if (tarifas.length > 0 && tarifaIndex < tarifas.length) {
            await tarifas[tarifaIndex].click()

            const tarifaOption = await page
                .locator("div")
                .filter({ hasText: new RegExp(`^${habitacion} - \\$`) })
                .nth(tarifaIndex)

            if ((await tarifaOption.count()) > 0) {
                await tarifaOption.click()
                tarifaSeleccionada = true
                break
            }
        }
        await page.waitForTimeout(1000)
    }

    if (!tarifaSeleccionada) {
        await page.getByText("Tipo de habitación no disponible en las fechas elegidas").click()
        return
    }

    await page.getByRole("button", { name: "Continuar" }).click()
    await page.getByRole("textbox", { name: "Nombre del huésped" }).fill(`prueba unitaria ${uniqueId}`)
    await page.getByRole("textbox", { name: "ejemplo@correo.com" }).fill(`prueba${uniqueId}@reserva.com`)
    await page
        .locator("div")
        .filter({ hasText: /^Selecciona una opción$/ })
        .nth(1)
        .click()

    if (tipoPago === "Total") {
        await page.getByRole("main").getByText("Total").first().click()
    } else {
        await page.getByText("Parcial").click()
        await page.getByRole("textbox", { name: "Ingresa el monto" }).fill(`$1,000`)
    }

    if (metodo) {
        await metodoPago(page, metodo)
    }
    await page
        .getByRole("textbox", { name: "Escribe un comentario..." })
        .fill(
            `Reserva: ${habitacion}, Tarifa: ${
                tarifaIndex + 1
            }, Tipo de pago: ${tipoPago}, Método: ${metodo}, ID: ${uniqueId}`
        )
    await page.getByRole("button", { name: "Registrar reserva" }).click()
    await page.getByRole("button", { name: "Aceptar" }).click()
}

const habitaciones = ["Pool & Spa Suite", "Pool Villa", "Sky Suite", "Junior Suite", "Handicap", "Master Suite", "6"]
const tiposPago: ("Total" | "Parcial")[] = ["Total", "Parcial"]
const metodosPagoPrueba = [
    "efectivo",
    "efectivo_easyRewards",
    "visa",
    "visa_easyRewards",
    "amex",
    "amex_easyRewards",
    "deposito",
    "deposito_easyRewards",
    "cortesia",
]

// TEST UNITARIOS
for (const habitacion of habitaciones) {
    for (const tipoPago of tiposPago) {
        for (let tarifaIndex = 0; tarifaIndex < 2; tarifaIndex++) {
            for (const metodo of metodosPagoPrueba) {
                test(`Reserva ${habitacion} tarifa ${tarifaIndex + 1} - Pago ${tipoPago} - Método ${metodo}`, async ({
                    page,
                }) => {
                    await login(page, "administracion")
                    await abrirRegistro(page)
                    await seleccionarFechas(page)
                    await reservarHabitacion(page, habitacion, tarifaIndex, tipoPago, metodo)
                })
            }
        }
    }
}
