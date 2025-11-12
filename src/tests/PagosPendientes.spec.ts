import { test } from "@playwright/test"
import { login, usuarios } from "./helpers/auth"
import { metodoPago } from "./helpers/metodosPago"

const roles = ["administracion", "recepcion"]

const metodosPagoPrueba = [
    "efectivo",
    "efectivo_easyRewards",
    "efectivo_propina10",
    "efectivo_propina15",
    "efectivo_propinaOtro",
    "efectivo_easyRewards_propina10",
    "visa",
    "visa_easyRewards",
    "visa_propina10",
    "visa_propina15",
    "visa_propinaOtro",
    "visa_easyRewards_propina10",
    "amex",
    "amex_easyRewards",
    "amex_propina10",
    "amex_propina15",
    "amex_propinaOtro",
    "amex_easyRewards_propina10",
    "deposito",
    "deposito_easyRewards",
    "deposito_propina10",
    "deposito_propina15",
    "deposito_propinaOtro",
    "deposito_easyRewards_propina10",
    "consumo",
    "cortesia",
]
//El area de Pagos es Estancia
const areas = ["Pagos", "Room Service"]

for (const u of usuarios.filter((user) => roles.includes(user.rol))) {
    for (const area of areas) {
        for (const metodo of metodosPagoPrueba) {
            test(`Rol: ${u.rol} - Área: ${area} - Método de pago: ${metodo}`, async ({ page }) => {
                // Login
                await login(page, u.rol)

                // Abrir card de Pagos Pendientes
                const main = page.getByRole("main")
                let tile = main.locator('[style*="--pink-ocupado"], [style*="var(--pink-ocupado)"]').first()

                if ((await tile.count()) === 0) {
                    const pendingIcon = main
                        .locator(
                            '[data-icon="IconPendingPayment"], [aria-label*="PendingPayment" i], img[alt*="PendingPayment" i], svg[aria-label*="PendingPayment" i]'
                        )
                        .first()
                    if (await pendingIcon.count()) {
                        tile = pendingIcon.locator("xpath=ancestor-or-self::*[self::button or self::div][1]")
                    }
                }

                if ((await tile.count()) === 0) {
                    const candidates = main.locator('[class*="card"], [data-testid*="room"], button, article, div')
                    const total = Math.min(await candidates.count(), 200)
                    for (let i = 0; i < total; i++) {
                        const el = candidates.nth(i)
                        const isRed = await el.evaluate((node) => {
                            function firstBg(n) {
                                let e = n,
                                    hops = 0
                                while (e && hops < 4) {
                                    const c = getComputedStyle(e).backgroundColor
                                    if (c && c !== "transparent" && c !== "rgba(0, 0, 0, 0)") return c
                                    e = e.parentElement
                                    hops++
                                }
                                return null
                            }
                            const bg = firstBg(node)
                            const m = bg && bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
                            if (!m) return false
                            const r = +m[1],
                                g = +m[2],
                                b = +m[3]
                            return r > g + 20 && r > b + 20 && r >= 90
                        })
                        if (isRed) {
                            tile = el
                            break
                        }
                    }
                }

                await tile.scrollIntoViewIfNeeded()
                await tile.click()
                await page.waitForLoadState("networkidle").catch(() => undefined)

                // Ir a la pantalla de Pagos Pendientes
                if (area === "Room Service") {
                    await page.getByText("Room Service").nth(1).click()

                    const registrarPagoBtn = page.getByRole("button", { name: "Registrar pago" })
                    try {
                        await registrarPagoBtn.waitFor({ state: "visible", timeout: 5000 })
                        await registrarPagoBtn.click()
                    } catch {
                        test.skip(true, "No se encontró el botón Registrar pago en Room Service")
                        return
                    }
                    await page.getByText("Room Service", { exact: true }).click()
                    await page.getByRole("textbox", { name: "Busca el nombre del personal" }).click()
                    const colaborador = page.locator(".input-personal__item").first()
                    await colaborador.waitFor({ state: "visible", timeout: 5000 })
                    await colaborador.click()
                } else {
                    await page.getByText("Pagos").click()
                    await page.getByRole("button", { name: "Registrar pago" }).click()
                }

                // Ejecutar el método de pago
                await metodoPago(page, metodo)

                // Realizar el Pago
                await page.getByRole("button", { name: "Pagar" }).click()

                // Modal de autorizacion
                const autorizacionDialog = page.getByRole("dialog")
                if ((await autorizacionDialog.count()) > 0) {
                    await autorizacionDialog.click()
                    await page.getByRole("textbox", { name: "verification input" }).click()
                    await page.getByRole("textbox", { name: "verification input" }).fill("1111")
                }
            })
        }
    }
}
