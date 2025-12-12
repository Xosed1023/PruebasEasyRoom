import { expect } from "@playwright/test"

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
            const val = Number(((await number.textContent()) || "").replace(/\D/g, "")) || 0
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
                const sizeLabel = card.locator(".product-card__size-label")
                await expect(sizeLabel).toBeVisible({ timeout: 3000 })
                const textPrev = await sizeLabel.textContent()
                const valuePrev = Number(textPrev?.replace(/\D/g, "")) || 0
                await updateCounter(counter, 1)
                const textNext = await sizeLabel.textContent()
                const valueNext = Number(textNext?.replace(/\D/g, "")) || 0
                expect(valueNext).toBeGreaterThan(valuePrev)
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

export { addAvailableProduct, addProduct }
