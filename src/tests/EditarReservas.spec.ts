import { test } from "@playwright/test"
// Calcular día actual y día siguiente
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 2)
const dayToday = today.getDate()
const dayNext = tomorrow.getDate()

test("Editar Reserva Pago Pendiente", async ({ page }) => {
    await page.goto("https://test.easyroom.io/")
    await page.getByTestId("email").fill("adminReplicaVsur@easyroom.io")
    await page.getByTestId("password").fill("ABCd1234")
    await page.getByRole("button", { name: "Ingresar" }).click()

    await page
        .locator("div")
        .filter({ hasText: /^Reservaciones$/ })
        .click()

    // Tomamos la primera reserva de la tabla
    const reservaCell = await page.getByRole("cell", { name: /prueba unitaria \d+/ }).first()
    const reservaText = await reservaCell.textContent()
    const reservaIdMatch = reservaText?.match(/\d+/)
    const reservaId = reservaIdMatch ? reservaIdMatch[0] : "0000"

    await reservaCell.click()
    await page.getByRole("button", { name: "Editar reservación" }).click()

    // Verificar si nth es 1 o 3 dependiendo el calendario
    const expected1to28 = Array.from({ length: 28 }, (_, i) => i + 1).join("")
    const allNumberElements = await page.locator("body >> text=/\\d+/").allTextContents()
    let ntdBase = 0
    let calendarText = ""
    for (const text of allNumberElements) {
        const onlyNumbers = text.replace(/\D/g, "")
        if (onlyNumbers.includes(expected1to28)) {
            calendarText = text
            if (onlyNumbers.startsWith(expected1to28)) {
                ntdBase = 0
            } else {
                ntdBase = 2
            }
            break
        }
    }
    const daysArray = calendarText.replace(/\D/g, "").match(/\d+/g)?.map(Number) || []
    const tomorrowIndex = daysArray.indexOf(dayNext)
    //dia actual
    await page
        .locator("div", { hasText: new RegExp(`^${dayToday}$`) })
        .locator(".day__item__dot")
        .click()
    //Dia siguiente usando nth1 o nth3 dependiendo calendario
    await page
        .locator("div")
        .filter({ hasText: RegExp(`^${dayNext}$`) })
        .nth(tomorrowIndex + ntdBase)
        .click()

    // Selección de tarifa
    await page.getByText("Master Suite2hasta 2 extra").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Master Suite - $").click()
    await page.getByRole("button", { name: "Continuar" }).click()

    // Selección de pago y monto
    await page
        .locator("div")
        .filter({ hasText: /^Selecciona una opción$/ })
        .nth(1)
        .click()
    await page.getByText("Pendiente").click()

    // Generar comentario dinámico
    const comentario = `
prueba ${reservaId} editar reserva agregando 1 dia mas, en total 3 noches con pago pendiente
`

    await page.getByRole("textbox", { name: "Escribe un comentario..." }).fill(comentario)
    await page.getByRole("button", { name: "Editar reserva" }).click()
})

test("Editar Reserva Pago Parcial", async ({ page }) => {
    await page.goto("https://test.easyroom.io/")
    await page.getByTestId("email").fill("adminReplicaVsur@easyroom.io")
    await page.getByTestId("password").fill("ABCd1234")
    await page.getByRole("button", { name: "Ingresar" }).click()

    await page
        .locator("div")
        .filter({ hasText: /^Reservaciones$/ })
        .click()

    // Tomamos la primera reserva de la tabla
    const reservaCell = await page.getByRole("cell", { name: /prueba unitaria \d+/ }).first()
    const reservaText = await reservaCell.textContent()
    const reservaIdMatch = reservaText?.match(/\d+/)
    const reservaId = reservaIdMatch ? reservaIdMatch[0] : "0000"

    await reservaCell.click()
    await page.getByRole("button", { name: "Editar reservación" }).click()

    // Verificar si nth es 1 o 3 dependiendo el calendario
    const expected1to28 = Array.from({ length: 28 }, (_, i) => i + 1).join("")
    const allNumberElements = await page.locator("body >> text=/\\d+/").allTextContents()
    let ntdBase = 0
    let calendarText = ""
    for (const text of allNumberElements) {
        const onlyNumbers = text.replace(/\D/g, "")
        if (onlyNumbers.includes(expected1to28)) {
            calendarText = text
            if (onlyNumbers.startsWith(expected1to28)) {
                ntdBase = 0
            } else {
                ntdBase = 2
            }
            break
        }
    }
    const daysArray = calendarText.replace(/\D/g, "").match(/\d+/g)?.map(Number) || []
    const tomorrowIndex = daysArray.indexOf(dayNext)
    //dia actual
    await page
        .locator("div", { hasText: new RegExp(`^${dayToday}$`) })
        .locator(".day__item__dot")
        .click()
    //Dia siguiente usando nth1 o nth3 dependiendo calendario
    await page
        .locator("div")
        .filter({ hasText: RegExp(`^${dayNext}$`) })
        .nth(tomorrowIndex + ntdBase)
        .click()

    // Selección de tarifa
    await page.getByText("Master Suite2hasta 2 extra").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Master Suite - $").click()
    await page.getByRole("button", { name: "Continuar" }).click()

    // Selección de pago y monto
    await page
        .locator("div")
        .filter({ hasText: /^Selecciona una opción$/ })
        .nth(1)
        .click()
    await page.getByText("Parcial", { exact: true }).click()
    await page.getByText("Selecciona una opción").click()
    await page.getByText("Visa o Mastercard").click()
    await page.getByRole("textbox", { name: "Ingresa el monto" }).click()
    await page.getByRole("textbox", { name: "Ingresa el monto" }).fill(`$100`)
    await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).click()
    await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill(`${reservaId.slice(0, 10)}`)
    await page.getByRole("textbox", { name: "Escribe un comentario..." }).click()

    // Generar comentario dinámico
    const comentario = `
prueba ${reservaId} editar reserva agregando 1 dia mas, en total 3 noches con pago parcial
`

    await page.getByRole("textbox", { name: "Escribe un comentario..." }).fill(comentario)
    await page.getByRole("button", { name: "Editar reserva" }).click()
})

test("Editar Reserva Pago Total", async ({ page }) => {
    await page.goto("https://test.easyroom.io/")
    await page.getByTestId("email").fill("adminReplicaVsur@easyroom.io")
    await page.getByTestId("password").fill("ABCd1234")
    await page.getByRole("button", { name: "Ingresar" }).click()

    await page
        .locator("div")
        .filter({ hasText: /^Reservaciones$/ })
        .click()

    // Tomamos la primera reserva de la tabla
    const reservaCell = await page.getByRole("cell", { name: /prueba unitaria \d+/ }).first()
    const reservaText = await reservaCell.textContent()
    const reservaIdMatch = reservaText?.match(/\d+/)
    const reservaId = reservaIdMatch ? reservaIdMatch[0] : "0000"

    await reservaCell.click()
    await page.getByRole("button", { name: "Editar reservación" }).click()

    // Verificar si nth es 1 o 3 dependiendo el calendario
    const expected1to28 = Array.from({ length: 28 }, (_, i) => i + 1).join("")
    const allNumberElements = await page.locator("body >> text=/\\d+/").allTextContents()
    let ntdBase = 0
    let calendarText = ""
    for (const text of allNumberElements) {
        const onlyNumbers = text.replace(/\D/g, "")
        if (onlyNumbers.includes(expected1to28)) {
            calendarText = text
            if (onlyNumbers.startsWith(expected1to28)) {
                ntdBase = 0
            } else {
                ntdBase = 2
            }
            break
        }
    }
    const daysArray = calendarText.replace(/\D/g, "").match(/\d+/g)?.map(Number) || []
    const tomorrowIndex = daysArray.indexOf(dayNext)
    //dia actual
    await page
        .locator("div", { hasText: new RegExp(`^${dayToday}$`) })
        .locator(".day__item__dot")
        .click()
    //Dia siguiente usando nth1 o nth3 dependiendo calendario
    await page
        .locator("div")
        .filter({ hasText: RegExp(`^${dayNext}$`) })
        .nth(tomorrowIndex + ntdBase)
        .click()

    // Selección de tarifa
    await page.getByText("Master Suite2hasta 2 extra").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Selecciona tipo de tarifa").click()
    await page.getByText("Master Suite - $").click()
    await page.getByRole("button", { name: "Continuar" }).click()

    // Selección de pago y monto
    await page
        .locator("div")
        .filter({ hasText: /^Selecciona una opción$/ })
        .nth(1)
        .click()
    await page.getByRole("main").getByText("Total", { exact: true }).click()
    await page.getByText("Selecciona una opción").click()
    await page.getByText("Visa o Mastercard").click()
    await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).click()
    await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill(`${reservaId.slice(0, 10)}`)
    await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).click()
    await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).fill("29407")
    await page.getByRole("textbox", { name: "Escribe un comentario..." }).click()

    // Generar comentario dinámico
    const comentario = `
prueba ${reservaId} editar reserva agregando 1 dia mas, en total 3 noches con pago total y abono de lovepoints
`

    await page.getByRole("textbox", { name: "Escribe un comentario..." }).fill(comentario)
    await page.getByRole("button", { name: "Editar reserva" }).click()
})
