import { test } from "@playwright/test"
import { login, usuarios } from "./helpers/auth"

const rolesEnv = process.env.ROL?.split(",").map((r) => r.trim()) || []
const roles = rolesEnv.length > 0 ? usuarios.filter((u) => rolesEnv.includes(u.rol)) : usuarios
// Crear una prueba independiente por cada rol
for (const u of roles) {
    test(`Login con rol: ${u.rol}`, async ({ page }) => {
        await login(page, u.rol)
    })
}
