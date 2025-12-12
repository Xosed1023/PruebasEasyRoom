import { Page } from "@playwright/test"

export const usuarios = [
    { rol: "valet", usuario: "valetReplica1Vsu@easyroom.io", password: "ABCd1234" },
    { rol: "recepcion", usuario: "recepcionReplicaVsur@easyroom.io", password: "ABCd1234" },
    { rol: "administracion", usuario: "adminReplicaVsur@easyroom.io", password: "ABCd1234" },
    { rol: "roomservice", usuario: "roomserviceVsur@easyroom.io", password: "ABCd1234" },
    { rol: "soporte", usuario: "soporte@easyroom.io", password: "ABCd1234" },
]

export async function login(page: Page, rol: string) {
    const user = usuarios.find((u) => u.rol === rol)
    if (!user) throw new Error(`No se encontró el rol ${rol}`)

    await page.goto("http://localhost:3000/")
    await page.getByTestId("email").click()
    await page.getByTestId("email").fill(user.usuario)
    await page.getByTestId("password").click()
    await page.getByTestId("password").fill(user.password)
    await page.locator("path").nth(2).click()
    await page
        .locator("form div")
        .filter({ hasText: "Recordarme en este equipoOlvidé mi contraseña" })
        .getByRole("img")
        .click()
    await page.getByRole("button", { name: "Ingresar" }).click()
}
