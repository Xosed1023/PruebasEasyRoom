import { test, expect } from "@playwright/test"
import { abrirRoomService } from "./helpers"

export const roles = ["recepcion", "administracion", "roomservice"]

async function multiClick(btn, times) {
    for (let i = 0; i < times; i++) {
        await expect(btn).toBeVisible({ timeout: 500 })
        await btn.click()
    }
}

async function getVisibleCards(page) {
    const cards = page.locator(".room-service__card:not(.product-card__skeleton-image)")
    await expect(cards.first()).toBeVisible({ timeout: 5000 })
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    return { cards, count }
}

async function updateCounter(counter, amount) {
    const btnMinus = counter.locator(".counter__button").first()
    const btnPlus = counter.locator(".counter__button").last()
    const number = counter.locator(".counter__number")
    if (amount > 0) await multiClick(btnPlus, amount)
    if (amount < 0) {
        for (let i = 0; i < Math.abs(amount); i++) {
            const val = Number((await number.textContent() || "").replace(/\D/g, "")) || 0
            if (val <= 0) break
            await expect(btnMinus).toBeVisible({ timeout: 500 })
            await btnMinus.click()
        }
    }
}

//Productos
async function addProduct(page, amount = 1, agotadoProp = false) {
    const { cards, count } = await getVisibleCards(page)
    for (let i = 0; i < count; i++) {
        const card = cards.nth(i)
        const agotado = await card.locator("text=Agotado").count()
        if ((agotadoProp && agotado > 0) || (!agotadoProp && agotado === 0)) {
            const counter = card.locator(".product-card__counter").first()
            await updateCounter(counter, amount)
            if (agotadoProp) {
                const sizeLabel = card.locator(".product-card__size-label");
                await expect(sizeLabel).toBeVisible({ timeout: 3000 });
                const textPrev = await sizeLabel.textContent();
                const valuePrev  = Number(textPrev?.replace(/\D/g, "")) || 0;
                await updateCounter(counter, 1);
                const textNext = await sizeLabel.textContent();
                const valueNext = Number(textNext?.replace(/\D/g, "")) || 0;
                expect(valueNext).toBeGreaterThan(valuePrev);
            }
            return counter
        }
    }
    throw new Error("No se encontró ningún producto disponible para agregar")
}

async function addAvailableProduct(page, amount = 1) {
    const { cards, count } = await getVisibleCards(page)
    for (let i = 0; i < count; i++) {
        const card = cards.nth(i)
        const agotado = await card.locator("text=Agotado").count()
        const costText = await card.locator(".product-card__cost").textContent()
        const costValue = Number(costText?.replace(/[^\d.-]/g, "") || 0)
        if (agotado === 0 && costValue > 0) {
            const counter = card.locator(".product-card__counter").first()
            await updateCounter(counter, amount)
            return counter
        }
    }
    throw new Error("No se encontró ningún producto disponible con costo mayor a 0 para agregar")
}

//Extras
async function openExtrasModal(page, edit = false) {
    if (!edit) await addProduct(page)
    await page.getByText(edit ? "Editar extras" : "Agregar extra").first().click()
    await expect(page.getByRole("dialog", { name: /Extras/i })).toBeVisible()
}

async function addExtras(page, extras: { index: number; cantidad: number }[] = []) {
    const items = page.locator(".modal-extras__item")
    for (const extra of extras) {
        const counter = items.nth(extra.index).locator(".counter__container")
        await updateCounter(counter, extra.cantidad)
    }
    await page.getByRole("button", { name: /Agregar extras/i }).click()
    await expect(page.locator("span.snackbar__title").filter({ hasText: "Extra" })).toBeVisible()
}

for (const rol of roles) {
    test.describe(` Rol: ${rol} - Productos de Room Service`, () => {
        test.beforeEach(async ({ page }) => {
            await abrirRoomService(page, rol)
            const firstCard = page.locator(
                ".room-service__card:not(.product-card__skeleton-image)"
            ).first()
            await expect(firstCard).toBeVisible()
            await expect(firstCard.locator(".product-card__name")).toHaveText(/.+/)
        })

        //Buscador
        test.describe("Buscador", () => {
            const validTerms = ["pizza", "agua", "toalla", "helado"]
            const invalidTerms = ["sinresultados", "abc123"]
            const setup = (page) => {
                const input = page.getByRole("textbox", { name: /Busca por nombre/i })
                const cards = page.locator(".room-service__card:visible")
                const cardNames = page.locator(".room-service__card:visible .product-card__name")
                const empty = page.locator(".empty-state", { hasText: "Sin resultados" })
                return { input, cards, cardNames, empty }
            }

            test("Con resultados", async ({ page }) => {
                const { input, cards, cardNames, empty } = setup(page)
                await expect(input).toBeVisible()
                for (const validTerm of validTerms) {
                    await input.fill(validTerm)
                    const regex = new RegExp(validTerm, "i")
                    await expect(cards.first()).toBeVisible()
                    await expect(cardNames.first()).toHaveText(regex)
                    const count = await cards.count()
                    expect(count, `Debería haber resultados para: ${validTerm}`).toBeGreaterThan(0)
                    const names = await cardNames.allTextContents()
                    for (const name of names) {
                        expect(
                            regex.test(name),
                            `El producto '${name}' no contiene la palabra clave '${validTerm}'`
                        ).toBeTruthy()
                    }
                    await expect(empty).toBeHidden()
                }
            })

            test("Sin resultados", async ({ page }) => {
                const { input, cards, empty } = setup(page)
                await expect(input).toBeVisible()
                for (const validTerm of invalidTerms) {
                    await input.fill(validTerm)
                    await expect(empty).toBeVisible()
                    const count = await cards.count()
                    expect(count, `No debería haber resultados para: ${validTerm}`).toBe(0)
                }
            })
        })
        
        //Categorias
        test("Tabs", async ({ page }) => {
            await page.waitForTimeout(1000)
            const tabs = page.locator(".room-service__tabs .input-tab")
            const labels = tabs.locator(".input-tabs__tab-label")
            const count = await tabs.count()
            expect(count).toBeGreaterThan(0)
            const names: string[] = []
            for (let i = 0; i < count; i++) {
                names.push(await labels.nth(i).innerText())
            }
            for (const name of names) {
                const tab = page.locator("div").filter({ hasText: new RegExp(`^${name}$`) })
                await page.waitForTimeout(600)  
                await expect(tab).toBeVisible()
                await tab.click({ force: true })
                const cardNames = page.locator(".room-service__card:visible .product-card__name")
                await expect(cardNames.first()).toBeVisible({ timeout: 10000 })
                const cardCount = await cardNames.count()
                expect(cardCount, `No hay productos para la categoría '${name}'`).toBeGreaterThan(0)
                const namesCards = await cardNames.allTextContents()
                for (const c of namesCards) {
                    expect(c.trim().length, `Card sin nombre en '${name}'`).toBeGreaterThan(0)
                }  
            }
        })

        //Cards
        test.describe("Cards", () => {

            test("Agregar primer producto disponible", async ({ page }) => {
                await addProduct(page)
                await expect(page.locator(".room-service__ticket-item").first()).toBeVisible({ timeout: 10000 })
            })

            test("Agregar producto agotado", async ({ page }) => {
                await addProduct(page, 2, true)
                await expect(page.locator(".room-service__ticket-item").first()).toBeVisible({ timeout: 10000 })
            })

            test("Agregar y disminuir productos", async ({ page }) => {
                const counter = await addProduct(page, 3);
                await updateCounter(counter, -2)
                await expect(page.locator(".room-service__ticket-item").first()).toBeVisible({ timeout: 10000 })
            })
        })
        
        //Resumen de pedido
        test.describe("Resumen de pedido", () => {

            test("Ver resumen al agregar productos", async ({ page }) => {
                await addProduct(page, 2)
                const resumen = page.locator(".room-service__ticket-item")
                await expect(resumen.first()).toBeVisible({ timeout: 10000 })
                const count = await resumen.count()
                expect(count).toBeGreaterThan(0)
            })

            test("Borrar orden completa", async ({ page }) => {
                await addProduct(page)
                const remove = page.locator(".room-service__ticket-link")
                if ((await remove.count()) > 0) {
                    await remove.click()
                    await expect(page.locator("text=No hay productos")).toBeVisible()
                }
            })

            test("Subtotal y total visibles", async ({ page }) => {
                await addAvailableProduct(page)
                const resumen = page.locator(".room-service__ticket-item")
                await expect(resumen.first()).toBeVisible({ timeout: 10000 })
                const ticketCurrency = page.locator(".room-service__ticket__currency")
                await expect(ticketCurrency).toBeVisible()
                await expect(ticketCurrency.locator(".ticket__subtotal")).toBeVisible()
                await expect(ticketCurrency.locator(".room-service__ticket__total")).toBeVisible()
            })

            test("Agregar y eliminar productos", async ({ page }) => {
                await addProduct(page, 2)
                await addAvailableProduct(page)
                const resumen = page.locator(".room-service__ticket-item")
                await expect(resumen.first()).toBeVisible({ timeout: 10000 })
                const removeIcon = page.locator(".room-service__ticket-item__remove");
                if ((await removeIcon.count()) > 0) {
                    await removeIcon.first().click();
                }
            })

            test("Agregar comentario a producto", async ({ page }) => {
                await addProduct(page)
                const commentBtn = page.getByText("Agregar comentario").first()
                await commentBtn.click()
                const dialog = page.locator(".room-service__modal-comment__contain");
                await expect(dialog).toBeVisible({ timeout: 5000 });
                const text = dialog.locator('textarea[placeholder="Escribe algo..."]');
                await text.fill("prueba unitaria");
                const addBtn = dialog.locator("button.room-service__modal-comment__button");
                await addBtn.click();
                const snackbarTitle = page.locator("span.snackbar__title", { hasText: "Comentario agregado" });
                await expect(snackbarTitle).toBeVisible({ timeout: 5000 });
            })
        })
        
        //Extras
        test.describe("Extras", () => {
            test.beforeEach(async ({ page }) => {
                await openExtrasModal(page)
                const items = page.locator(".modal-extras__item")
                await expect(items.first()).toBeVisible()
            })
            test("Categoría", async ({ page }) => {
                const dropdown = page.locator(".modal-extras__drop .dropdown-component__area")
                await dropdown.click()
                const items = page.locator(".dropdown-component__container .dropdown-component__item .dropdown-component__item__box")
                const totalItems = await items.count()
                for (let i = 0; i < totalItems; i++) {
                    const categoryName = (await items.nth(i).textContent())?.trim()
                    if (!categoryName) continue
                    await items.nth(i).click()
                    await expect(dropdown.locator(".dropdown-component__value")).toHaveText(categoryName)
                    const ticketExtras = page.locator(".room-service__ticket-extra-item span")
                    const totalExtras = await ticketExtras.count()
                    for (let j = 0; j < totalExtras; j++) {
                        const extraText = (await ticketExtras.nth(j).textContent())?.trim()
                        expect(extraText).toContain(categoryName)
                    }
                    if (i < totalItems - 1) {
                        await dropdown.click()
                    }
                }
            })

            test.describe("Buscador de extras", () => {
                test("Con resultados", async ({ page }) => {
                    const input = page.getByRole("textbox", { name: "Busca por nombre de artículo", exact: true});
                    await expect(input).toBeVisible();                 
                    const validTerms = ["pizza", "agua", "toalla", "helado"]
                    for (const validTerm of validTerms) {
                        await input.fill(validTerm);
                        const options = page.locator(".room-search__options");
                        await expect(options).toBeVisible();
                        const items = options.locator(".room-search__item");
                        await expect(items.count()).resolves.toBeGreaterThan(0);
                        const match = items.filter({ hasText: validTerm });
                        await expect(match.first()).toBeVisible();
                    }
                })

                test("Sin resultados", async ({ page }) => {
                    const input = page.getByRole("textbox", { name: "Busca por nombre de artículo", exact: true});
                    await expect(input).toBeVisible();
                    const invalidTerms = ["sinresultados", "abc123"]
                    for (const invalidTerm of invalidTerms) {
                        await input.fill(invalidTerm)
                        const options = page.locator(".room-search__options");
                        await expect(options).toHaveCount(0);
                        const items = page.locator(".room-search__item");
                        await expect(items).toHaveCount(0);
                    }
                })
            })

            test("Agregar extras", async ({ page }) => {
                await addExtras(page, [
                    { index: 0, cantidad: 2 },
                    { index: 0, cantidad: -1 },
                    { index: 4, cantidad: 5 }
                ]);
            })

            test("Editar extra", async ({ page }) => {
                await addExtras(page, [{ index: 2, cantidad: 2 }]);
                await openExtrasModal(page, true)
                const editCounter = page.locator(".modal-extras__item .counter__button:not(.block)").first()
                await editCounter.click()
                await page.getByRole("button", { name: /Actualizar extras/i }).click()
                await expect(page.locator("span.snackbar__title").filter({ hasText: "Extras actualizados" })).toBeVisible()
            })

            test("Cerrar modal", async ({ page }) => {
                const closeBtn = page.locator("div.modal__close")
                await closeBtn.click()
                await expect(page.locator("dialog.modal-extras")).toBeHidden()
            })
        })

    })
}
