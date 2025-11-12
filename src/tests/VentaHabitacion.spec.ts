import { test, expect, Page } from "@playwright/test"

test.setTimeout(120_000)

const usuarios = [
    { rol: "valet", usuario: "valetReplica1Vsu@easyroom.io", password: "ABCd1234" },
    { rol: "recepcion", usuario: "recepcionReplicaVsur@easyroom.io", password: "ABCd1234" },
    { rol: "administracion", usuario: "adminReplicaVsur@easyroom.io", password: "ABCd1234" },
]

for (const u of usuarios) {
    test.describe(`Flujos (${u.rol})`, () => {
        test.beforeEach(async ({ page }) => {
            //Login
            await page.goto("https://test.easyroom.io/")
            await page.getByTestId("email").fill(u.usuario)
            await page.getByTestId("password").fill("ABCd1234")
            await page.locator("path").nth(2).click()
            await page
                .locator("form div")
                .filter({ hasText: "Recordarme en este equipoOlvidé mi contraseña" })
                .getByRole("img")
                .click()
            await page.getByRole("button", { name: "Ingresar" }).click()
            await page.getByRole("heading", { name: /Habitaciones/i }).waitFor()

            //Abrir una card DISPONIBLE (verde)
            const main = page.getByRole("main")
            let tile = main.locator('[style*="--green-card-available"], [style*="var(--green-card-available)"]').first()

            if ((await tile.count()) === 0) {
                const dollarIcon = main
                    .locator(
                        '[style*="--green-available"], [style*="var(--green-available)"], [data-icon="Dollar"], [data-icon="dollar"], [aria-label*="Dollar" i], img[alt*="Dollar" i], svg[aria-label*="Dollar" i]'
                    )
                    .first()
                if (await dollarIcon.count()) {
                    tile = dollarIcon.locator("xpath=ancestor-or-self::*[self::button or self::div][1]")
                }
            }

            if ((await tile.count()) === 0) {
                const candidates = main.locator('[class*="card"], [data-testid*="room"], button, article, div')
                const total = Math.min(await candidates.count(), 200)
                for (let i = 0; i < total; i++) {
                    const el = candidates.nth(i)
                    const isGreen = await el.evaluate((node) => {
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
                        return g > r + 20 && g > b + 20 && g >= 90
                    })
                    if (isGreen) {
                        tile = el
                        break
                    }
                }
            }

            await expect(tile, "No encontré ninguna habitación verde (disponible).").toBeVisible({ timeout: 15000 })
            await tile.scrollIntoViewIfNeeded()
            await tile.click()
            await page.waitForLoadState("networkidle").catch(() => undefined)
        })
        function parseMontoMXN(s: string): number {
            const digits = s.replace(/[^\d]/g, "")
            return parseInt(digits || "0", 10)
        }
        // Valet
        if (u.rol === "valet") {
            test.describe(" venta de habitacion desde el rol de Valet Parking", () => {
                // Solo corre estas pruebas cuando el rol del loop sea el de valet
                test.skip(u.rol !== "valet", "Solo aplica para el usuario Valet.")

                async function abrirVenta(page: Page) {
                    let actionBtn = page
                        .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                        .first()
                    if ((await actionBtn.count()) === 0) {
                        actionBtn = page
                            .locator(
                                ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                            )
                            .first()
                    }
                    await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                    try {
                        await actionBtn.click()
                    } catch {
                        await actionBtn.click({ force: true })
                    }
                    //Esperar la pantalla de venta
                    const headingVenta = page
                        .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                        .first()
                    async function waitSaleSignals(timeout = 20000) {
                        const end = Date.now() + timeout
                        while (Date.now() < end) {
                            const hit = await Promise.race([
                                headingVenta
                                    .waitFor({ state: "visible", timeout: 1000 })
                                    .then(() => "heading")
                                    .catch(() => null),
                            ])
                            if (hit) return hit
                        }
                        return null
                    }
                    let hit = await waitSaleSignals(20000)
                    if (!hit) {
                        try {
                            await actionBtn.click({ force: true })
                        } catch {}
                        hit = await waitSaleSignals(15000)
                    }
                    expect(
                        hit,
                        "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                    ).toBeTruthy()
                }

                test("Valet: Tipo de pago = Pendiente", async ({ page }) => {
                    await abrirVenta(page)
                    await page
                        .locator("div")
                        .filter({ hasText: /^Pendiente$/ })
                        .nth(2)
                        .click()
                    await page.getByRole("button", { name: /Vender habitación/i }).click()
                })

                test("Valet: Tipo de pago = Parcial (Love points + restante pendiente)", async ({ page }) => {
                    await abrirVenta(page)

                    // Tipo de pago -> Parcial
                    await page.getByText("Tipo de pago").click()
                    await page
                        .locator("div")
                        .filter({ hasText: /^Pendiente$/ })
                        .nth(1)
                        .click()
                    await page.getByText(/^Parcial$/).click()

                    // Método de pago -> Love points
                    await page.getByText("Método de pago").first().click()
                    await page
                        .locator("div")
                        .filter({ hasText: /^Love points$/ })
                        .nth(1)
                        .click()

                    // Número de membresía
                    await page.getByText("Número de membresía").click()
                    const inputM = page.getByRole("textbox", { name: /Máximo 5 dígitos/i })
                    await inputM.fill("29407")
                    await inputM.press("Tab")

                    // Consultar saldo
                    const consultar = page.getByText("Consultar saldo", { exact: true }).first()
                    await consultar.scrollIntoViewIfNeeded()
                    await consultar.click({ force: true })

                    const hConsulta = page.getByRole("heading", { name: /Consulta de saldo y pago/i })
                    const hInsuf = page.getByRole("heading", { name: /Saldo insuficiente/i })

                    await Promise.race([
                        hConsulta.waitFor({ timeout: 3000 }).catch(() => undefined),
                        hInsuf.waitFor({ timeout: 3000 }).catch(() => undefined),
                    ])

                    if (!(await hConsulta.isVisible()) && !(await hInsuf.isVisible())) {
                        await consultar.dispatchEvent("click")
                        await Promise.race([
                            hConsulta.waitFor({ timeout: 3000 }).catch(() => undefined),
                            hInsuf.waitFor({ timeout: 3000 }).catch(() => undefined),
                        ])
                    }

                    // Registrar (si alcanza será total; si no, parcial)
                    const btnParcial = page.getByRole("button", { name: /Registrar pago parcial con puntos/i })
                    const btnTotal = page.getByRole("button", { name: /Registrar pago total con puntos/i })
                    if (await btnParcial.isVisible({ timeout: 500 })) {
                        await btnParcial.click()
                    } else {
                        await btnTotal.click()
                    }

                    // Finaliza la venta
                    await page.getByRole("button", { name: /Vender habitación/i }).click()
                })
                // vender habitacion - valet - pago-total o parcial
                test("Valet: Tipo de pago = Total (Love points)", async ({ page }) => {
                    await abrirVenta(page)

                    // Tipo de pago -> Total
                    await page.getByText("Tipo de pago").click()
                    await page
                        .locator("div")
                        .filter({ hasText: /^Pendiente$/ })
                        .nth(1)
                        .click()
                    await page.getByText(/^Total$/).click()

                    // Método de pago -> Love points siempre
                    await page.getByText("Método de pago").first().click()
                    await page
                        .locator("div")
                        .filter({ hasText: /^Love points$/ })
                        .nth(1)
                        .click()

                    // Número de membresía
                    await page.getByText("Número de membresía").click()
                    const inputM = page.getByRole("textbox", { name: /Máximo 5 dígitos/i })
                    await inputM.fill("29407")
                    await inputM.press("Tab")

                    // Consultar saldo -> debe abrir: "Saldo insuficiente" o "Consulta de saldo y pago"
                    const consultar = page.getByText(/^Consultar saldo$/, { exact: true }).first()
                    const hConsulta = page.getByRole("heading", { name: /Consulta de saldo y pago/i })
                    const btnRealizarParcial = page.getByRole("button", { name: /Realizar pago parcial/i })

                    await consultar.scrollIntoViewIfNeeded()
                    await consultar.click()
                    let opened = await Promise.race([
                        btnRealizarParcial
                            .waitFor({ timeout: 2500 })
                            .then(() => true)
                            .catch(() => false),
                        hConsulta
                            .waitFor({ timeout: 2500 })
                            .then(() => true)
                            .catch(() => false),
                    ])

                    if (!opened) {
                        await consultar.scrollIntoViewIfNeeded()
                        await consultar.click({ force: true })
                        opened = await Promise.race([
                            btnRealizarParcial
                                .waitFor({ timeout: 2500 })
                                .then(() => true)
                                .catch(() => false),
                            hConsulta
                                .waitFor({ timeout: 2500 })
                                .then(() => true)
                                .catch(() => false),
                        ])
                    }

                    if (!opened) {
                        await consultar.dispatchEvent("click")
                        await Promise.race([
                            btnRealizarParcial.waitFor({ timeout: 2500 }).catch(() => undefined),
                            hConsulta.waitFor({ timeout: 2500 }).catch(() => undefined),
                        ])
                    }

                    // opcion según la modal que abrio
                    if (await btnRealizarParcial.isVisible().catch(() => false)) {
                        // --- Saldo insuficiente → pasar a Parcial
                        await btnRealizarParcial.click()
                        // espera a que cierre la modal y Valida que "Tipo de pago" quedó conforme a lo seleccionado en la modal
                        const bloqueTipo = page
                            .locator("div")
                            .filter({ hasText: /^Tipo de pago$/ })
                            .first()

                        let triggerTipo = bloqueTipo
                            .locator(".dropdown-component__area")
                            .first()
                            .or(bloqueTipo.locator(':is(button,[role="button"],[aria-haspopup])').first())

                        if (!(await triggerTipo.count())) {
                            const cont = bloqueTipo.locator("xpath=..")
                            triggerTipo = cont
                                .locator(':is(.dropdown-component__area, button,[role="button"],[aria-haspopup])')
                                .first()
                        }

                        // 1) Reabre el dropdown y valida que la opción "Parcial" esté seleccionada
                        let validado = false
                        try {
                            await triggerTipo.scrollIntoViewIfNeeded()
                            await triggerTipo.click({ force: true })

                            const optParcial = page.getByRole("option", { name: /^Parcial$/i }).first()
                            await expect(optParcial).toHaveAttribute("aria-selected", "true", { timeout: 3000 })
                            validado = true

                            // Cierra el dropdown
                            try {
                                await page.keyboard.press("Escape")
                            } catch {}
                        } catch {}

                        // 2) Fallback: si no pudimos abrir/validar el rol, verifica el texto en el trigger
                        if (!validado) {
                            await expect(triggerTipo).toContainText(/Parcial/i, { timeout: 8000 })
                        }

                        // Vender habitación
                        await page.getByRole("button", { name: /Vender habitación/i }).click()
                    }
                })
            })
        }

        // Recepcion y administración
        if (u.rol === "administracion" || u.rol === "recepcion") {
            test.describe("Venta Habitacion para rol de administrador y recepcionista", () => {
                test.describe("Con auto", () => {
                    //1. Realizar pago con tarjeta
                    test("Pagando con tarjeta", async ({ page }) => {
                        // “Rentar” o “Vender”
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        //Esperar la pantalla de venta
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        const btnConAuto = page.getByText("Con auto").first()
                        const placaInput = page.getByRole("textbox", { name: "Escribe la matrícula" }).first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                    btnConAuto
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "conauto")
                                        .catch(() => null),
                                    placaInput
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "placa")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        // Título flexible
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await btnConAuto.click()
                        await placaInput.click()
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("-")
                        await placaInput.press("2")
                        await placaInput.press("2")
                        await placaInput.press("Y")
                        await page.getByRole("textbox", { name: "Ingresa un color" }).click()
                        await page.getByRole("listitem").filter({ hasText: "Rojo" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Marca \(opcional\)$/ })
                            .locator("div")
                            .first()
                            .click()
                        await page.getByRole("listitem").filter({ hasText: "Audi" }).click()
                        const modelo = page.getByRole("textbox", { name: "Escribe el modelo" })
                        await modelo.click()
                        await modelo.fill("2025")
                        await page.getByRole("button", { name: "Registrar auto" }).click()
                        // Método de pago
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        await page.getByText("Visa o Mastercard").click()
                        await page.getByPlaceholder("Máximo 10 dígitos").click()
                        await page.getByPlaceholder("Máximo 10 dígitos").fill("12345678909")
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //2. Realizar pago efectivo y abono de Love Points
                    test("Pagando con Efectivo y abono de Love Points", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        const btnConAuto = page.getByText("Con auto").first()
                        const placaInput = page.getByRole("textbox", { name: "Escribe la matrícula" }).first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                    btnConAuto
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "conauto")
                                        .catch(() => null),
                                    placaInput
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "placa")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await btnConAuto.click()
                        await placaInput.click()
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("-")
                        await placaInput.press("2")
                        await placaInput.press("2")
                        await placaInput.press("Y")
                        await page.getByRole("textbox", { name: "Ingresa un color" }).click()
                        await page.getByRole("listitem").filter({ hasText: "Rojo" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Marca \(opcional\)$/ })
                            .locator("div")
                            .first()
                            .click()
                        await page.getByRole("listitem").filter({ hasText: "Audi" }).click()
                        const modelo = page.getByRole("textbox", { name: "Escribe el modelo" })
                        await modelo.click()
                        await modelo.fill("2025")
                        await page.getByRole("button", { name: "Registrar auto" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        await page.locator(".dropdown-component__item__box").first().click()
                        await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).click()
                        await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).fill("29407")
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //3. Realizar pago con cortesía
                    test("Pagando con Cortesia", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        const btnConAuto = page.getByText("Con auto").first()
                        const placaInput = page.getByRole("textbox", { name: "Escribe la matrícula" }).first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                    btnConAuto
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "conauto")
                                        .catch(() => null),
                                    placaInput
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "placa")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await btnConAuto.click()
                        await placaInput.click()
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("-")
                        await placaInput.press("2")
                        await placaInput.press("2")
                        await placaInput.press("Y")
                        await page.getByRole("textbox", { name: "Ingresa un color" }).click()
                        await page.getByRole("listitem").filter({ hasText: "Rojo" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Marca \(opcional\)$/ })
                            .locator("div")
                            .first()
                            .click()
                        await page.getByRole("listitem").filter({ hasText: "Audi" }).click()
                        const modelo = page.getByRole("textbox", { name: "Escribe el modelo" })
                        await modelo.click()
                        await modelo.fill("2025")
                        await page.getByRole("button", { name: "Registrar auto" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        await page.getByText("Cortesía").click()
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //4. Realizar pago con Consumo interno y persona extra
                    test("Pagando con Consumo interno y persona extra", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        const btnConAuto = page.getByText("Con auto").first()
                        const placaInput = page.getByRole("textbox", { name: "Escribe la matrícula" }).first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                    btnConAuto
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "conauto")
                                        .catch(() => null),
                                    placaInput
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "placa")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await btnConAuto.click()
                        await placaInput.click()
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("-")
                        await placaInput.press("2")
                        await placaInput.press("2")
                        await placaInput.press("Y")
                        await page.getByRole("textbox", { name: "Ingresa un color" }).click()
                        await page.getByRole("listitem").filter({ hasText: "Rojo" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Marca \(opcional\)$/ })
                            .locator("div")
                            .first()
                            .click()
                        await page.getByRole("listitem").filter({ hasText: "Audi" }).click()
                        const modelo = page.getByRole("textbox", { name: "Escribe el modelo" })
                        await modelo.click()
                        await modelo.fill("2025")
                        await page.getByRole("button", { name: "Registrar auto" }).click()
                        await page
                            .locator("div:nth-child(2) > .counter > .counter__container > svg:nth-child(3)")
                            .click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        await page.getByText("Consumo interno").click()
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //5. Realizar pago con Mixto (efectivo y amex)
                    test("Pagando con Mixto (efectivo y amex)", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        const btnConAuto = page.getByText("Con auto").first()
                        const placaInput = page.getByRole("textbox", { name: "Escribe la matrícula" }).first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                    btnConAuto
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "conauto")
                                        .catch(() => null),
                                    placaInput
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "placa")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await page.locator("svg:nth-child(3)").first().click()
                        await btnConAuto.click()
                        await placaInput.click()
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("-")
                        await placaInput.press("2")
                        await placaInput.press("2")
                        await placaInput.press("Y")
                        await page.getByRole("textbox", { name: "Ingresa un color" }).click()
                        await page.getByRole("listitem").filter({ hasText: "Rojo" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Marca \(opcional\)$/ })
                            .locator("div")
                            .first()
                            .click()
                        await page.getByRole("listitem").filter({ hasText: "Audi" }).click()
                        const modelo = page.getByRole("textbox", { name: "Escribe el modelo" })
                        await modelo.click()
                        await modelo.fill("2025")
                        await page.getByRole("button", { name: "Registrar auto" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        // Abre Mixto
                        await page.getByText("Mixto").click()
                        await expect(page.getByRole("heading", { name: /Método de pago mixto/i })).toBeVisible()
                        // Lee el total dinámicamente de la UI
                        const totalLabel = page.getByText(/Total de cuenta:\s*\$?[\d.,]+\s*MXN/i).first()
                        const totalText = (await totalLabel.textContent()) ?? ""
                        const total = parseMontoMXN(totalText)
                        expect(total, `No pude obtener el total desde "${totalText}"`).toBeGreaterThan(0)
                        // Paga la mayor parte en efectivo
                        // Paga una parte pequeña con AMEX (100 MXN si alcanza; si el total < 100, que AMEX sea 1 MXN)
                        const amexMonto = Math.min(100, Math.max(1, total - 1))
                        const efectivoMonto = total - amexMonto
                        expect(efectivoMonto + amexMonto).toBe(total)
                        // Método de pago 1 -> Efectivo
                        await page.getByText("Método de pago 1").click()
                        await page
                            .getByRole("textbox", { name: "Ingresa el monto" })
                            .first()
                            .fill(String(efectivoMonto))
                        // Abre el dropdown
                        await page
                            .locator(".dropdown-component.modal-mixto__select .dropdown-component__area")
                            .first()
                            .click()
                        await page.getByText("Efectivo", { exact: true }).click()
                        // Método de pago 2 -> AMEX
                        await page.getByText("Método de pago 2").click()
                        await page.getByRole("textbox", { name: "Ingresa el monto" }).nth(1).fill(String(amexMonto))
                        await page
                            .locator(".dropdown-component.modal-mixto__select .dropdown-component__area")
                            .nth(1)
                            .click()
                        await page.getByText("AMEX", { exact: true }).click()
                        await page.getByText("Número de tarjeta o referencia").click()
                        await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("9876543210")
                        //valida que los montos sumen el total
                        const btnRegistrar = page.getByRole("button", { name: "Registrar pago" })
                        await expect(btnRegistrar).toBeEnabled({ timeout: 5000 })
                        await btnRegistrar.click()
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //6. Realizar pago con Mixto (50/50: Depósito/Transfer + Tarjeta)
                    test("Pagando con Mixto (50/50: Depósito/Transfer + Tarjeta)", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        const btnConAuto = page.getByText("Con auto").first()
                        const placaInput = page.getByRole("textbox", { name: "Escribe la matrícula" }).first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                    btnConAuto
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "conauto")
                                        .catch(() => null),
                                    placaInput
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "placa")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await btnConAuto.click()
                        await placaInput.click()
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("-")
                        await placaInput.press("2")
                        await placaInput.press("2")
                        await placaInput.press("Y")
                        await page.getByRole("textbox", { name: "Ingresa un color" }).click()
                        await page.getByRole("listitem").filter({ hasText: "Rojo" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Marca \(opcional\)$/ })
                            .locator("div")
                            .first()
                            .click()
                        await page.getByRole("listitem").filter({ hasText: "Audi" }).click()
                        const modelo = page.getByRole("textbox", { name: "Escribe el modelo" })
                        await modelo.fill("2025")
                        await page.getByRole("button", { name: "Registrar auto" }).click()
                        // Abrir modal pago Mixto
                        await page.getByText("Mixto").click()
                        await expect(page.getByRole("heading", { name: /Método de pago mixto/i })).toBeVisible()
                        //Leer total dinámico y calcular 50/50
                        const totalLabel = page.getByText(/Total de cuenta:\s*\$?[\d.,]+\s*MXN/i).first()
                        const totalText = (await totalLabel.textContent()) ?? ""
                        const total = parseMontoMXN(totalText) // tu helper existente
                        expect(total, `No pude obtener el total desde "${totalText}"`).toBeGreaterThan(0)
                        // mitad y mitad; si es impar, la tarjeta cubre el redondeo
                        let montoDepositoTransfer = Math.floor(total / 2)
                        let montoTarjeta = total - montoDepositoTransfer
                        // asegura montos > 0 por si acaso (totales muy chicos)
                        if (montoDepositoTransfer === 0) {
                            montoDepositoTransfer = 1
                            montoTarjeta = Math.max(1, total - 1)
                        }
                        expect(montoDepositoTransfer + montoTarjeta).toBe(total)
                        // Método de pago 1. Depósito/Transfer
                        await page.getByText("Método de pago 1").click()
                        const inputMontoDeposito = page.getByRole("textbox", { name: "Ingresa el monto" }).first()
                        await inputMontoDeposito.fill(String(montoDepositoTransfer))
                        await page.locator(".modal-mixto__select .dropdown-component__area").first().click()
                        await page.getByText("Depósito/Transfer", { exact: true }).click()
                        await page.getByRole("textbox", { name: "Ingresa número" }).fill("1234567890")
                        // Método de pago 2.Tarjeta (Visa o Mastercard)
                        await page.getByText("Método de pago 2").click()
                        const inputMontoTarjeta = page.getByRole("textbox", { name: "Ingresa el monto" }).nth(1)
                        await inputMontoTarjeta.fill(String(montoTarjeta))
                        await page.locator(".modal-mixto__select .dropdown-component__area").nth(1).click()
                        await page.getByText("Visa o Mastercard", { exact: true }).click()
                        await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("9876543210")
                        //Registrar y vender
                        const btnRegistrar = page.getByRole("button", { name: "Registrar pago" })
                        await expect(btnRegistrar).toBeEnabled({ timeout: 5000 })
                        await btnRegistrar.click()
                        await page.getByRole("button", { name: /Vender habitación/i }).click()
                    })
                    //7. Realizar pago con Mixto (Efectivo y Consumo interno) y propina 10%
                    test("Pagando Mixto con propina 10% (Método 1: Efectivo, Método 2: Consumo interno)", async ({
                        page,
                    }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        const btnConAuto = page.getByText("Con auto").first()
                        const placaInput = page.getByRole("textbox", { name: "Escribe la matrícula" }).first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                    btnConAuto
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "conauto")
                                        .catch(() => null),
                                    placaInput
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "placa")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await page.locator("svg:nth-child(3)").first().click()
                        await btnConAuto.click()
                        await placaInput.click()
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("-")
                        await placaInput.press("2")
                        await placaInput.press("2")
                        await placaInput.press("Y")
                        await page.getByRole("textbox", { name: "Ingresa un color" }).click()
                        await page.getByRole("listitem").filter({ hasText: "Rojo" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Marca \(opcional\)$/ })
                            .locator("div")
                            .first()
                            .click()
                        await page.getByRole("listitem").filter({ hasText: "Audi" }).click()
                        const modelo = page.getByRole("textbox", { name: "Escribe el modelo" })
                        await modelo.click()
                        await modelo.fill("2025")
                        await page.getByRole("button", { name: "Registrar auto" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        // Abre Mixto
                        await page.getByText("Mixto").click()
                        await expect(page.getByRole("heading", { name: /Método de pago mixto/i })).toBeVisible()
                        //monto total dinámicos de la UI
                        const leerTotalCuenta = async () => {
                            const t =
                                (await page
                                    .getByText(/Total de cuenta:\s*\$[\d.,]+\s*MXN/i)
                                    .first()
                                    .textContent()) ?? ""
                            return parseMontoMXN(t)
                        }
                        const leerPorPagar = async () => {
                            const t =
                                (await page
                                    .getByText(/Por pagar:\s*\$[\d.,]+\s*MXN/i)
                                    .first()
                                    .textContent()) ?? ""
                            return parseMontoMXN(t)
                        }
                        const total = await leerTotalCuenta()
                        expect(total).toBeGreaterThan(0)
                        //Método de pago 1: Efectivo
                        await page.getByText("Método de pago 1").click()
                        //Monto del método 1 pagando la mitad del total
                        const montoEfectivo = Math.max(1, Math.floor(total / 2))
                        const inputMonto1 = page.getByRole("textbox", { name: "Ingresa el monto" }).first()
                        await inputMonto1.fill(String(montoEfectivo))
                        await page.locator(".modal-mixto__select .dropdown-component__area").first().click()
                        await page.getByText("Efectivo", { exact: true }).click()
                        //Propina 10% del monto pagado en el método 1
                        const porPagarAntes = await leerPorPagar()
                        await page
                            .getByText(/^10%\s*\(/)
                            .first()
                            .click()
                        const porPagarDespues = await leerPorPagar()
                        expect(porPagarDespues).toBeLessThanOrEqual(porPagarAntes)
                        //Método de pago 2: Consumo interno
                        const restante = await leerPorPagar() // lo que falta pagar excluyendo propina
                        await page.getByText("Método de pago 2").click()
                        const inputMonto2 = page.getByRole("textbox", { name: "Ingresa el monto" }).nth(1)
                        await inputMonto2.fill(String(restante))
                        await page.locator(".modal-mixto__select .dropdown-component__area").nth(1).click()
                        await page.getByText("Consumo interno", { exact: true }).click()
                        // Debe quedar Por pagar = $0 MXN
                        await expect(page.getByText(/Por pagar:\s*\$0(\.00)?\s*MXN/i)).toBeVisible({ timeout: 3000 })
                        // Registrar y vender
                        const btnRegistrar = page.getByRole("button", { name: "Registrar pago" })
                        await expect(btnRegistrar).toBeEnabled({ timeout: 5000 })
                        await btnRegistrar.click()
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //8. Realizar pago con Depósito/Transfer
                    test("Pagando con Depósito/Transfer", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        const btnConAuto = page.getByText("Con auto").first()
                        const placaInput = page.getByRole("textbox", { name: "Escribe la matrícula" }).first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                    btnConAuto
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "conauto")
                                        .catch(() => null),
                                    placaInput
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "placa")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await btnConAuto.click()
                        await placaInput.click()
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("-")
                        await placaInput.press("2")
                        await placaInput.press("2")
                        await placaInput.press("Y")
                        await page.getByRole("textbox", { name: "Ingresa un color" }).click()
                        await page.getByRole("listitem").filter({ hasText: "Rojo" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Marca \(opcional\)$/ })
                            .locator("div")
                            .first()
                            .click()
                        await page.getByRole("listitem").filter({ hasText: "Audi" }).click()
                        const modelo = page.getByRole("textbox", { name: "Escribe el modelo" })
                        await modelo.click()
                        await modelo.fill("2025")
                        await page.getByRole("button", { name: "Registrar auto" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        await page.getByText("Depósito/Transfer").click()
                        await page.getByText("Número de clabe o referencia").click()
                        await page.getByPlaceholder("Ingresa número").click()
                        await page.getByPlaceholder("Ingresa número").fill("23456789")
                        // Propina 10%
                        await page.getByText("Propina (opcional)").click()
                        await page.getByText("Monto o porcentaje").click()
                        // Intenta el chip como <button>
                        const chip10 = page.getByRole("button", { name: /^10%(\s|\(|$)/ }).first()
                        if (await chip10.count()) {
                            await chip10.click()
                        } else {
                            // el texto "10%" grande
                            const pct = page.getByText(/^10%$/).first()
                            if (await pct.count()) {
                                const chipContainer = pct.locator(
                                    "xpath=ancestor-or-self::*[self::button or self::a or self::div][1]"
                                )
                                await chipContainer.click()
                            } else {
                                // Fallback|: calcula 10% del total del resumen
                                const parseMXN = (s: string) => {
                                    const clean = (s || "").replace(/[^\d.,]/g, "").replace(/,/g, "")
                                    const n = parseFloat(clean)
                                    return isNaN(n) ? 0 : n
                                }
                                // intenta leer el "Total" del panel derecho
                                let total = 0
                                const candidates = [
                                    page
                                        .locator('xpath=//div[normalize-space()="Total"]/following-sibling::*[1]')
                                        .first(),
                                    page
                                        .getByText(/^Total$/)
                                        .locator('xpath=following::*[contains(., "$")][1]')
                                        .first(),
                                    page
                                        .locator("aside,section")
                                        .getByText(/\$\s*[\d.,]+/)
                                        .last(),
                                ]
                                for (const c of candidates) {
                                    if (await c.count()) {
                                        const txt =
                                            (await c.innerText().catch(() => "")) ||
                                            (await c.textContent().catch(() => "")) ||
                                            ""
                                        total = parseMXN(txt)
                                        if (total > 0) break
                                    }
                                }
                                if (total <= 0) throw new Error("No pude leer el Total para calcular la propina 10%.")
                                const propina10 = Math.max(1, Math.round(total * 0.1))
                                await page.getByRole("button", { name: /Otro monto/i }).click()
                                await page
                                    .getByRole("textbox", { name: /propina|monto|porcentaje/i })
                                    .first()
                                    .fill(String(propina10))
                            }
                        }
                        // ¿Quién recibió la propina?
                        await page.getByText("¿Quién recibió la propina?").click()
                        await page.getByRole("textbox", { name: "Nombre del personal" }).click()
                        const opcionExacta = page.getByText("ValetReplicaVSur - -", { exact: true }).first()
                        if (await opcionExacta.count()) {
                            await opcionExacta.click()
                        } else {
                            const primeraOpcion = page.locator('[role="option"]').first()
                            if (await primeraOpcion.count()) await primeraOpcion.click()
                        }
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    // 9. Realizar pago con Amex y hospedaje extra
                    test("Pagando con Amex y hospedaje extra", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        //Esperar la pantalla de venta
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        const btnConAuto = page.getByText("Con auto").first()
                        const placaInput = page.getByRole("textbox", { name: "Escribe la matrícula" }).first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                    btnConAuto
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "conauto")
                                        .catch(() => null),
                                    placaInput
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "placa")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        // Título flexible
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await btnConAuto.click()
                        await placaInput.click()
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("-")
                        await placaInput.press("2")
                        await placaInput.press("2")
                        await placaInput.press("Y")
                        await page.getByRole("textbox", { name: "Ingresa un color" }).click()
                        await page.getByRole("listitem").filter({ hasText: "Rojo" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Marca \(opcional\)$/ })
                            .locator("div")
                            .first()
                            .click()
                        await page.getByRole("listitem").filter({ hasText: "Audi" }).click()
                        const modelo = page.getByRole("textbox", { name: "Escribe el modelo" })
                        await modelo.click()
                        await modelo.fill("2025")
                        await page.getByRole("button", { name: "Registrar auto" }).click()
                        //persona extra
                        await page
                            .locator("div:nth-child(2) > .counter > .counter__container > svg:nth-child(3)")
                            .click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        await page.getByText("AMEX").click()
                        await page.getByPlaceholder("Máximo 10 dígitos").click()
                        await page.getByPlaceholder("Máximo 10 dígitos").fill("123456789")
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    test("Pagando con love points", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        //Esperar la pantalla de venta
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        const btnConAuto = page.getByText("Con auto").first()
                        const placaInput = page.getByRole("textbox", { name: "Escribe la matrícula" }).first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                    btnConAuto
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "conauto")
                                        .catch(() => null),
                                    placaInput
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "placa")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        // Título flexible
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await btnConAuto.click()
                        await placaInput.click()
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("Y")
                        await placaInput.press("-")
                        await placaInput.press("2")
                        await placaInput.press("2")
                        await placaInput.press("Y")
                        await page.getByRole("textbox", { name: "Ingresa un color" }).click()
                        await page.getByRole("listitem").filter({ hasText: "Rojo" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Marca \(opcional\)$/ })
                            .locator("div")
                            .first()
                            .click()
                        await page.getByRole("listitem").filter({ hasText: "Audi" }).click()
                        const modelo = page.getByRole("textbox", { name: "Escribe el modelo" })
                        await modelo.click()
                        await modelo.fill("2025")
                        await page.getByRole("button", { name: "Registrar auto" }).click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        await page.getByText("Love points").click()
                        // Ingresa membresía y consulta saldo
                        await page.getByText("Número de membresía").click()
                        await page.getByRole("textbox", { name: /5 dígitos/i }).fill("29407")
                        await page.getByText("Consultar saldo", { exact: true }).click()
                        //Modal "Consulta de saldo y pago"
                        await expect(page.getByRole("heading", { name: /Consulta de saldo y pago/i })).toBeVisible()
                        // Helpers para montos
                        const parseMXN = (s: string) => {
                            const clean = (s || "").replace(/[^\d.,]/g, "").replace(/,/g, "")
                            const n = parseFloat(clean)
                            return isNaN(n) ? 0 : Math.round(n)
                        }
                        const leer = async (re: RegExp) => {
                            const loc = page.getByText(re).first()
                            const txt =
                                (await loc.innerText().catch(() => "")) ||
                                (await loc.textContent().catch(() => "")) ||
                                ""
                            return parseMXN(txt)
                        }
                        // Lee el saldo pendiente (“Por pagar”) y cubre el resto con método 2 solo si es > 0
                        const porPagar = await leer(/Por pagar:\s*\$[\d.,]+\s*MXN/i)
                        if (porPagar > 0) {
                            // Método de pago 2 -> Efectivo y monto = porPagar
                            await page.getByText("Método de pago 2").click()
                            const inputMonto2 = page.getByRole("textbox", { name: "Ingresa el monto" }).nth(1)
                            await inputMonto2.fill(String(porPagar))
                            await inputMonto2.press("Tab")
                            //abrir "Forma de pago" del Método de pago 2
                            const contMetodo2 = page
                                .getByText(/^Método de pago 2$/)
                                .locator("xpath=ancestor::*[self::div or self::section][1]")
                            // botón con texto "Selecciona una opción"
                            let triggerForma2 = contMetodo2
                                .getByRole("button", { name: /Selecciona una opción/i })
                                .first()
                            if (!(await triggerForma2.count())) {
                                triggerForma2 = contMetodo2
                                    .locator(':is(button,[role="button"],[aria-haspopup],div,span)')
                                    .filter({ hasText: /Selecciona una opción/i })
                                    .first()
                            }
                            await triggerForma2.click()
                            const opcionEfectivo = page
                                .getByRole("option", { name: /^Efectivo$/i })
                                .first()
                                .or(page.getByText(/^Efectivo$/i).first())
                            await opcionEfectivo.click()
                            // Verifica que quede en $0 MXN
                            await expect(page.getByText(/Por pagar:\s*\$0(\.00)?\s*MXN/i)).toBeVisible({
                                timeout: 3000,
                            })
                        }
                        // Registrar pago y vender
                        await page.getByRole("button", { name: /Registrar pago/i }).click()
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                })

                test.describe("Sin auto", () => {
                    //1. Realizar pago con Efectivo y abono de Love Points
                    test("Pagando con Efectivo y abono de Love Points", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        await page.locator(".dropdown-component__item__box").first().click()
                        await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).click()
                        await page.getByRole("textbox", { name: "Ingresa membresía 5 dígitos" }).fill("29407")
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //2. Realizar pago con tarjeta
                    test("Pagando con tarjeta", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        // Título flexible
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        // Método de pago
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        await page.getByText("Visa o Mastercard").click()
                        await page.getByPlaceholder("Máximo 10 dígitos").click()
                        await page.getByPlaceholder("Máximo 10 dígitos").fill("12345678909")
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //3. Realizar pago con cortesía
                    test("Pagando con Cortesia", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        await page.getByText("Cortesía").click()
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //4. Realizar pago con Consumo interno y persona extra
                    test("Pagando con Consumo interno y persona extra", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        // Agregar persona extra
                        await page
                            .locator("div:nth-child(2) > .counter > .counter__container > svg:nth-child(3)")
                            .click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        await page.getByText("Consumo interno").click()
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //5. Realizar pago con Mixto (efectivo y amex)
                    test("Pagando con Mixto (efectivo y amex)", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await page.locator("svg:nth-child(3)").first().click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        // Abre Mixto
                        await page.getByText("Mixto").click()
                        await expect(page.getByRole("heading", { name: /Método de pago mixto/i })).toBeVisible()
                        // Lee el total dinámicamente de la UI
                        const totalLabel = page.getByText(/Total de cuenta:\s*\$?[\d.,]+\s*MXN/i).first()
                        const totalText = (await totalLabel.textContent()) ?? ""
                        const total = parseMontoMXN(totalText)
                        expect(total, `No pude obtener el total desde "${totalText}"`).toBeGreaterThan(0)
                        // Paga la mayor parte en efectivo
                        // Paga una parte pequeña con AMEX (100 MXN si alcanza; si el total < 100, que AMEX sea 1 MXN)
                        const amexMonto = Math.min(100, Math.max(1, total - 1))
                        const efectivoMonto = total - amexMonto
                        expect(efectivoMonto + amexMonto).toBe(total)
                        // Método de pago 1 -> Efectivo
                        await page.getByText("Método de pago 1").click()
                        await page
                            .getByRole("textbox", { name: "Ingresa el monto" })
                            .first()
                            .fill(String(efectivoMonto))
                        // Abre el dropdown
                        await page
                            .locator(".dropdown-component.modal-mixto__select .dropdown-component__area")
                            .first()
                            .click()
                        await page.getByText("Efectivo", { exact: true }).click()
                        // Método de pago 2 -> AMEX
                        await page.getByText("Método de pago 2").click()
                        await page.getByRole("textbox", { name: "Ingresa el monto" }).nth(1).fill(String(amexMonto))
                        await page
                            .locator(".dropdown-component.modal-mixto__select .dropdown-component__area")
                            .nth(1)
                            .click()
                        await page.getByText("AMEX", { exact: true }).click()
                        await page.getByText("Número de tarjeta o referencia").click()
                        await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("9876543210")
                        //valida que los montos sumen el total
                        const btnRegistrar = page.getByRole("button", { name: "Registrar pago" })
                        await expect(btnRegistrar).toBeEnabled({ timeout: 5000 })
                        await btnRegistrar.click()
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //6. Realizar pago con Mixto (50/50: Depósito/Transfer + Tarjeta)
                    test("Pagando con Mixto (50/50: Depósito/Transfer + Tarjeta)", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        // Abrir modal pago Mixto
                        await page.getByText("Mixto").click()
                        await expect(page.getByRole("heading", { name: /Método de pago mixto/i })).toBeVisible()
                        //Leer total dinámico y calcular 50/50
                        const totalLabel = page.getByText(/Total de cuenta:\s*\$?[\d.,]+\s*MXN/i).first()
                        const totalText = (await totalLabel.textContent()) ?? ""
                        const total = parseMontoMXN(totalText) // tu helper existente
                        expect(total, `No pude obtener el total desde "${totalText}"`).toBeGreaterThan(0)
                        // mitad y mitad; si es impar, la tarjeta cubre el redondeo
                        let montoDepositoTransfer = Math.floor(total / 2)
                        let montoTarjeta = total - montoDepositoTransfer
                        // asegura montos > 0 por si acaso (totales muy chicos)
                        if (montoDepositoTransfer === 0) {
                            montoDepositoTransfer = 1
                            montoTarjeta = Math.max(1, total - 1)
                        }
                        expect(montoDepositoTransfer + montoTarjeta).toBe(total)
                        // Método de pago 1. Depósito/Transfer
                        await page.getByText("Método de pago 1").click()
                        const inputMontoDeposito = page.getByRole("textbox", { name: "Ingresa el monto" }).first()
                        await inputMontoDeposito.fill(String(montoDepositoTransfer))
                        await page.locator(".modal-mixto__select .dropdown-component__area").first().click()
                        await page.getByText("Depósito/Transfer", { exact: true }).click()
                        await page.getByRole("textbox", { name: "Ingresa número" }).fill("1234567890")
                        // Método de pago 2.Tarjeta (Visa o Mastercard)
                        await page.getByText("Método de pago 2").click()
                        const inputMontoTarjeta = page.getByRole("textbox", { name: "Ingresa el monto" }).nth(1)
                        await inputMontoTarjeta.fill(String(montoTarjeta))
                        await page.locator(".modal-mixto__select .dropdown-component__area").nth(1).click()
                        await page.getByText("Visa o Mastercard", { exact: true }).click()
                        await page.getByRole("textbox", { name: "Máximo 10 dígitos" }).fill("9876543210")
                        //Registrar y vender
                        const btnRegistrar = page.getByRole("button", { name: "Registrar pago" })
                        await expect(btnRegistrar).toBeEnabled({ timeout: 5000 })
                        await btnRegistrar.click()
                        await page.getByRole("button", { name: /Vender habitación/i }).click()
                    })
                    //7. Realizar pago con Mixto (Efectivo y Consumo interno) y propina 10%
                    test("Pagando Mixto con propina 10% (Método 1: Efectivo, Método 2: Consumo interno)", async ({
                        page,
                    }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await page.locator("svg:nth-child(3)").first().click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        // Abre Mixto
                        await page.getByText("Mixto").click()
                        await expect(page.getByRole("heading", { name: /Método de pago mixto/i })).toBeVisible()
                        //monto total dinámicos de la UI
                        const leerTotalCuenta = async () => {
                            const t =
                                (await page
                                    .getByText(/Total de cuenta:\s*\$[\d.,]+\s*MXN/i)
                                    .first()
                                    .textContent()) ?? ""
                            return parseMontoMXN(t)
                        }
                        const leerPorPagar = async () => {
                            const t =
                                (await page
                                    .getByText(/Por pagar:\s*\$[\d.,]+\s*MXN/i)
                                    .first()
                                    .textContent()) ?? ""
                            return parseMontoMXN(t)
                        }
                        const total = await leerTotalCuenta()
                        expect(total).toBeGreaterThan(0)
                        //Método de pago 1: Efectivo
                        await page.getByText("Método de pago 1").click()
                        //Monto del método 1 pagando la mitad del total
                        const montoEfectivo = Math.max(1, Math.floor(total / 2))
                        const inputMonto1 = page.getByRole("textbox", { name: "Ingresa el monto" }).first()
                        await inputMonto1.fill(String(montoEfectivo))
                        await page.locator(".modal-mixto__select .dropdown-component__area").first().click()
                        await page.getByText("Efectivo", { exact: true }).click()
                        //Propina 10% del monto pagado en el método 1
                        const porPagarAntes = await leerPorPagar()
                        await page
                            .getByText(/^10%\s*\(/)
                            .first()
                            .click()
                        const porPagarDespues = await leerPorPagar()
                        expect(porPagarDespues).toBeLessThanOrEqual(porPagarAntes)
                        //Método de pago 2: Consumo interno
                        const restante = await leerPorPagar() // lo que falta pagar excluyendo propina
                        await page.getByText("Método de pago 2").click()
                        const inputMonto2 = page.getByRole("textbox", { name: "Ingresa el monto" }).nth(1)
                        await inputMonto2.fill(String(restante))
                        await page.locator(".modal-mixto__select .dropdown-component__area").nth(1).click()
                        await page.getByText("Consumo interno", { exact: true }).click()
                        // Debe quedar Por pagar = $0 MXN
                        await expect(page.getByText(/Por pagar:\s*\$0(\.00)?\s*MXN/i)).toBeVisible({ timeout: 3000 })
                        // Registrar y vender
                        const btnRegistrar = page.getByRole("button", { name: "Registrar pago" })
                        await expect(btnRegistrar).toBeEnabled({ timeout: 5000 })
                        await btnRegistrar.click()
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //8. Realizar pago con Depósito/Transfer
                    test("Pagando con Depósito/Transfer", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        await page.getByText("Depósito/Transfer").click()
                        await page.getByText("Número de clabe o referencia").click()
                        await page.getByPlaceholder("Ingresa número").click()
                        await page.getByPlaceholder("Ingresa número").fill("23456789")
                        // Propina 10%
                        await page.getByText("Propina (opcional)").click()
                        await page.getByText("Monto o porcentaje").click()
                        // Intenta el chip como <button>
                        const chip10 = page.getByRole("button", { name: /^10%(\s|\(|$)/ }).first()
                        if (await chip10.count()) {
                            await chip10.click()
                        } else {
                            // el texto "10%" grande
                            const pct = page.getByText(/^10%$/).first()
                            if (await pct.count()) {
                                const chipContainer = pct.locator(
                                    "xpath=ancestor-or-self::*[self::button or self::a or self::div][1]"
                                )
                                await chipContainer.click()
                            } else {
                                // Fallback|: calcula 10% del total del resumen
                                const parseMXN = (s: string) => {
                                    const clean = (s || "").replace(/[^\d.,]/g, "").replace(/,/g, "")
                                    const n = parseFloat(clean)
                                    return isNaN(n) ? 0 : n
                                }
                                // intenta leer el "Total" del panel derecho
                                let total = 0
                                const candidates = [
                                    page
                                        .locator('xpath=//div[normalize-space()="Total"]/following-sibling::*[1]')
                                        .first(),
                                    page
                                        .getByText(/^Total$/)
                                        .locator('xpath=following::*[contains(., "$")][1]')
                                        .first(),
                                    page
                                        .locator("aside,section")
                                        .getByText(/\$\s*[\d.,]+/)
                                        .last(),
                                ]
                                for (const c of candidates) {
                                    if (await c.count()) {
                                        const txt =
                                            (await c.innerText().catch(() => "")) ||
                                            (await c.textContent().catch(() => "")) ||
                                            ""
                                        total = parseMXN(txt)
                                        if (total > 0) break
                                    }
                                }
                                if (total <= 0) throw new Error("No pude leer el Total para calcular la propina 10%.")
                                const propina10 = Math.max(1, Math.round(total * 0.1))
                                await page.getByRole("button", { name: /Otro monto/i }).click()
                                await page
                                    .getByRole("textbox", { name: /propina|monto|porcentaje/i })
                                    .first()
                                    .fill(String(propina10))
                            }
                        }
                        // ¿Quién recibió la propina?
                        await page.getByText("¿Quién recibió la propina?").click()
                        await page.getByRole("textbox", { name: "Nombre del personal" }).click()
                        const opcionExacta = page.getByText("ValetReplicaVSur - -", { exact: true }).first()
                        if (await opcionExacta.count()) {
                            await opcionExacta.click()
                        } else {
                            const primeraOpcion = page.locator('[role="option"]').first()
                            if (await primeraOpcion.count()) await primeraOpcion.click()
                        }
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //9. Realizar pago con Amex y hospedaje extra
                    test("Pagando con Amex y hospedaje extra", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }
                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })
                        await page.locator("svg:nth-child(3)").first().click()
                        //persona extra
                        await page
                            .locator("div:nth-child(2) > .counter > .counter__container > svg:nth-child(3)")
                            .click()
                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()
                        await page.getByText("AMEX").click()
                        await page.getByPlaceholder("Máximo 10 dígitos").click()
                        await page.getByPlaceholder("Máximo 10 dígitos").fill("123456789")
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                    //     //10. Realizar pago con love points
                    test("Pagando con love points", async ({ page }) => {
                        let actionBtn = page
                            .locator('button:has-text("Rentar habitación"), button:has-text("Vender habitación")')
                            .first()
                        if ((await actionBtn.count()) === 0) {
                            actionBtn = page
                                .locator(
                                    ':is(button,[role="button"],a,div,span):has-text("Rentar habitación"), :is(button,[role="button"],a,div,span):has-text("Vender habitación")'
                                )
                                .first()
                        }
                        await actionBtn.waitFor({ state: "visible", timeout: 20000 }).catch(() => undefined)
                        try {
                            await actionBtn.click()
                        } catch {
                            await actionBtn.click({ force: true })
                        }

                        //Esperar la pantalla de venta
                        const headingVenta = page
                            .getByRole("heading", { name: /Venta habitación|Rentar habitación/i })
                            .first()
                        async function waitSaleSignals(timeout = 20000) {
                            const end = Date.now() + timeout
                            while (Date.now() < end) {
                                const hit = await Promise.race([
                                    headingVenta
                                        .waitFor({ state: "visible", timeout: 1000 })
                                        .then(() => "heading")
                                        .catch(() => null),
                                ])
                                if (hit) return hit
                            }
                            return null
                        }

                        let hit = await waitSaleSignals(20000)
                        if (!hit) {
                            try {
                                await actionBtn.click({ force: true })
                            } catch {}
                            hit = await waitSaleSignals(15000)
                        }
                        expect(
                            hit,
                            "No apareció la pantalla de venta (heading, 'Con auto' o input de matrícula)."
                        ).toBeTruthy()

                        // Título flexible
                        await expect(headingVenta).toBeVisible({ timeout: 20000 })

                        await page
                            .locator("div")
                            .filter({ hasText: /^Efectivo$/ })
                            .nth(2)
                            .click()

                        await page.getByText("Love points").click()

                        // Ingresa membresía y consulta saldo
                        await page.getByText("Número de membresía").click()
                        await page.getByRole("textbox", { name: /5 dígitos/i }).fill("29407")
                        await page.getByText("Consultar saldo", { exact: true }).click()

                        //Modal "Consulta de saldo y pago"
                        await expect(page.getByRole("heading", { name: /Consulta de saldo y pago/i })).toBeVisible()

                        // Helpers para montos
                        const parseMXN = (s: string) => {
                            const clean = (s || "").replace(/[^\d.,]/g, "").replace(/,/g, "")
                            const n = parseFloat(clean)
                            return isNaN(n) ? 0 : Math.round(n)
                        }
                        const leer = async (re: RegExp) => {
                            const loc = page.getByText(re).first()
                            const txt =
                                (await loc.innerText().catch(() => "")) ||
                                (await loc.textContent().catch(() => "")) ||
                                ""
                            return parseMXN(txt)
                        }
                        // Lee el saldo pendiente (“Por pagar”) y cubre el resto con método 2 solo si es > 0
                        const porPagar = await leer(/Por pagar:\s*\$[\d.,]+\s*MXN/i)

                        if (porPagar > 0) {
                            // Método de pago 2 -> Efectivo y monto = porPagar
                            await page.getByText("Método de pago 2").click()

                            const inputMonto2 = page.getByRole("textbox", { name: "Ingresa el monto" }).nth(1)
                            await inputMonto2.fill(String(porPagar))
                            await inputMonto2.press("Tab")

                            //abrir "Forma de pago" del Método de pago 2
                            const contMetodo2 = page
                                .getByText(/^Método de pago 2$/)
                                .locator("xpath=ancestor::*[self::div or self::section][1]")

                            // botón con texto "Selecciona una opción"
                            let triggerForma2 = contMetodo2
                                .getByRole("button", { name: /Selecciona una opción/i })
                                .first()
                            if (!(await triggerForma2.count())) {
                                triggerForma2 = contMetodo2
                                    .locator(':is(button,[role="button"],[aria-haspopup],div,span)')
                                    .filter({ hasText: /Selecciona una opción/i })
                                    .first()
                            }
                            await triggerForma2.click()
                            const opcionEfectivo = page
                                .getByRole("option", { name: /^Efectivo$/i })
                                .first()
                                .or(page.getByText(/^Efectivo$/i).first())
                            await opcionEfectivo.click()

                            // Verifica que quede en $0 MXN
                            await expect(page.getByText(/Por pagar:\s*\$0(\.00)?\s*MXN/i)).toBeVisible({
                                timeout: 3000,
                            })
                        }

                        // Registrar pago y vender
                        await page.getByRole("button", { name: /Registrar pago/i }).click()
                        await page.getByRole("button", { name: "Vender habitación" }).click()
                    })
                })
            })
        }
    })
}
