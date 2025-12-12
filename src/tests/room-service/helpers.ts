import { expect, Page } from "@playwright/test"
import { login } from "src/tests/helpers/auth"

export async function abrirRoomService(page: Page, rol: string) {
    await login(page, rol)
    await page.getByRole("heading", { name: "Habitaciones" }).waitFor({ state: "visible" })

    await page
        .locator("div")
        .filter({ hasText: /^Room Service$/ })
        .click()

    await expect(page).toHaveURL(/.*room-service-home/)
    await expect(page.getByRole("heading", { name: "Room service" })).toBeVisible()
}
