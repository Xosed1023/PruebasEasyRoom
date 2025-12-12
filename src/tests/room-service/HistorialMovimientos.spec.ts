import { test, expect, Locator } from "@playwright/test"
import { abrirRoomService } from "./helpers"

const roles = ["recepcion", "administracion", "roomservice"]
const today = new Date()

const verifySubtitleDate  = async (subtitle: Locator, date: Date) => {
    await expect(subtitle).toBeVisible()
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit", year: "numeric" }
    const [month, day, year] = date.toLocaleDateString("en-US", options).replace(",", "").split(" ")
    await expect(subtitle).toHaveText(`${month}, ${day} ${year}`)
}

const openCalendarModal = async (page) => {
    const btn = page.locator(".historial__icon-calendar")
    await btn.click()
    const modal = page.locator("dialog.modal__content")
    await expect(modal).toBeVisible()
    return modal
}

const getDayElement = async (modal: Locator, dayNumber: number) => {
    const days = modal.locator(".input-date-modal__month-days .day__item")
    const count = await days.count()
    for (let i = 0; i < count; i++) {
        const day = days.nth(i)
        const text = (await day.textContent())?.trim()
        const value = parseInt(text || "0", 10)
        const clases = await day.getAttribute("class")
        if (value === dayNumber && !clases?.includes("disabled")) return day
    }
    return null
}

const selectPreviousDay = async (modal: Locator, currentDay: number) => {
    const previousDay = await getDayElement(modal, currentDay - 1)
    expect(previousDay).not.toBeNull()
    if (!previousDay) throw new Error("No se encontró el día anterior")
    await previousDay.click()
    const selected = await getDayElement(modal, currentDay - 1)
    if (!selected) throw new Error("No se pudo seleccionar el día anterior")
    const newText = (await selected.textContent())?.trim()
    expect(newText).toBe((currentDay - 1).toString())
    return parseInt(newText || "0", 10)
}

const verifyDisabledFutureDays = async (modal: Locator) => {
    const days = modal.locator(".input-date-modal__month-days .day__item")
    const count = await days.count()
    for (let i = 0; i < count; i++) {
        const day = days.nth(i)
        const dateStr = await day.getAttribute("data-date")
        if (!dateStr) continue
        const date = new Date(dateStr)
        const classes = await day.getAttribute("class")
        if (date > today) expect(classes).toContain("disabled")
        else expect(classes).not.toContain("disabled")
    }
}

for (const rol of roles) {
    test.describe(`Rol: ${rol} - Historial de Movimientos de Room Service`, () => {
        test.beforeEach(async ({ page }) => {
            await abrirRoomService(page, rol)
            await page.locator(".room-service__right-button > div:nth-child(3)").click()
            await expect(page.getByRole("heading", { name: "Historial de movimientos" })).toBeVisible()
        })

        test("Boton Regresar", async ({ page }) => {
            await page.locator('div').filter({ hasText: /^Regresar$/ }).locator('div').click();
        })

        test("Fecha actual", async ({ page }) => {
            const subtitle = page.locator(".screen__head__subtitle")
            await verifySubtitleDate (subtitle, today)
        })

        test("Tabs", async ({ page }) => {
            const tabs = ["Room service", "Mostrador", "Restaurante"].map(text =>
                page.locator(".tab-menu__item").filter({ hasText: text })
            )
            for (const tab of tabs) await expect(tab).toBeVisible()
            for (const tab of tabs) {
                await tab.click()
                await expect(tab).toHaveClass(/tab-menu__item--active|tab-menu--dark__item--active/)
            }
        })

        test.describe("Buscador", () => {
            const getLocators = (page) => ({
                input: page.locator(".ordenes__search__input"),
                rows: page.locator(".historial-rs__table-container tbody tr"),
                emptyMessage: page.locator(".historial-rs__table").filter({ hasText: "No tienes órdenes registradas" }),
            })

            test("Sin resultados", async ({ page }) => {
                const { input, rows, emptyMessage } = getLocators(page)
                await input.fill("12345")
                await page.waitForTimeout(400)
                await expect(rows).toHaveCount(0)
                await expect(emptyMessage).toBeVisible()
            })

            test("Con resultados", async ({ page }) => {
                const { input } = getLocators(page)
                await page.waitForTimeout(1000)
                const month = (today.getMonth() + 1).toString().padStart(2, "0")
                const year = today.getFullYear().toString().slice(-2)
                const pattern = `-${month}${year}-`
                await input.fill(pattern)
                await page.waitForTimeout(500)
                const matchingRows = page.locator(`.historial-rs__table-container tbody tr:has-text("${pattern}")`)
                await expect(matchingRows.first()).toBeVisible()
                const count = await matchingRows.count()
                expect(count, "No hay filas visibles que coincidan con la búsqueda").toBeGreaterThan(0);
                for (let i = 0; i < count; i++) {
                    const rowText = (await matchingRows.nth(i).locator("td").first().textContent())?.trim() ?? ""
                    expect(rowText).toMatch(new RegExp(`^[A-Z]{2}-${month}${year}-\\d+$`))
                }
            })
        })

        test("Tabla y paginador", async ({ page }) => {
            const rows = page.locator(".historial-rs__table-container tbody tr")
            await expect(rows.first()).toBeVisible()
            const btnNext  = page.locator(".table-paginator__wrapper .paginator button").filter({ hasText: ">" })
            if (await btnNext .count()) await btnNext .click()
        })

        test.describe("Calendario", () => {
            test("Mes y año actual", async ({ page }) => {
                const modal = await openCalendarModal(page)
                const monthLabel = modal.locator(".input-date-modal__month-label")
                const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
                await expect(monthLabel).toHaveText(`${monthNames[today.getMonth()]} ${today.getFullYear()}`)
            })

            test("Día actual seleccionado", async ({ page }) => {
                const modal = await openCalendarModal(page)
                const selected = modal.locator(".input-date-modal__month-days .day__item.selected")
                await expect(selected).toHaveText(today.getDate().toString())
            })

            test("Seleccionar día anterior", async ({ page }) => {
                const modal = await openCalendarModal(page)
                const currentDay = (await modal.locator(".input-date-modal__month-days .day__item.selected").textContent())?.trim()
                await selectPreviousDay(modal, parseInt(currentDay || "0", 10))
            })

            test("Botón Seleccionar", async ({ page }) => {
                const modal = await openCalendarModal(page)
                const currentDay = (await modal.locator(".input-date-modal__month-days .day__item.selected").textContent())?.trim()
                const newDay = await selectPreviousDay(modal, parseInt(currentDay || "0", 10))
                await modal.locator('button:has-text("Seleccionar")').click()
                await expect(modal).toHaveCount(0)
                const subtitle = page.locator(".screen__head__subtitle")
                const newDate = new Date(today)
                newDate.setDate(newDay)
                await verifySubtitleDate (subtitle, newDate)
            })

            test("Botón Borrar filtro", async ({ page }) => {
                const modal = await openCalendarModal(page)
                await modal.locator(".input-date-modal__footer__button:has-text('Borrar filtro')").click()
                await expect(modal).toBeHidden()
            })

            test("Navegar entre meses", async ({ page }) => {
                const modal = await openCalendarModal(page)
                const monthLabel = modal.locator(".input-date-modal__month-label")
                const btnNext = modal.locator(".input-date-modal__paginator__button").nth(1)
                const btnPrev = modal.locator(".input-date-modal__paginator__button").nth(0)

                const currentMonth = await monthLabel.textContent() 
                expect(await btnNext.getAttribute("class")).toContain("disabled") 
                await btnPrev.click() 
                const monthPrev = await monthLabel.textContent() 
                expect(monthPrev).not.toBe(currentMonth) 
                expect(await btnNext.getAttribute("class")).not.toContain("disabled") 
                await btnNext.click() 
                const monthNext = await monthLabel.textContent() 
                expect(monthNext).toBe(currentMonth) 
                expect(await btnNext.getAttribute("class")).toContain("disabled")
            })

            test("Día posterior deshabilitados", async ({ page }) => {
                const modal = await openCalendarModal(page)
                await verifyDisabledFutureDays(modal)
            })

            test("Mes posterior deshabilitado", async ({ page }) => {
                const modal = await openCalendarModal(page)
                const btnNext = modal.locator(".input-date-modal__paginator__button").nth(1)
                expect(await btnNext.getAttribute("class")).toContain("disabled")
            })
        })
    })
}
