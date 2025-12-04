import aes from "crypto-js/aes"
import enc from "crypto-js/enc-utf8"
import { startAuthentication, startRegistration } from "@simplewebauthn/browser"
import { VITE_APP_AUTHN_KEY, VITE_APP_LOCAL_API, VITE_APP_USER_KEY } from "@/config/environment"

type Key = {
    email: string
    password: string
}

interface User extends Key {
    user_id: string
}

export function useSimpleAuthn() {
    const getStorageKey = () => {
        return localStorage.getItem(VITE_APP_AUTHN_KEY)
    }

    const setEncodeUser = (key: Key) => {
        const value = aes.encrypt(JSON.stringify(key), VITE_APP_USER_KEY).toString()
        localStorage.setItem(VITE_APP_AUTHN_KEY, value)

        return
    }

    const getDecodeUser = (): Key | undefined => {
        const key = getStorageKey()
        if (key) {
            const bytes = aes.decrypt(key, VITE_APP_USER_KEY)
            const data = JSON.parse(bytes.toString(enc))
            return data
        }

        return
    }

    const setRegisterBiometric = async (user: User) => {
        const userId = user.user_id
        if (!userId) {
            return
        }

        try {
            // 1. Get registration options from the server
            const resp = await fetch(`${VITE_APP_LOCAL_API}/webauthn/register/begin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            })

            const { options } = await resp.json()

            if (!resp.ok) {
                return
            }

            // 2. Pass options to the authenticator
            const attResp = await startRegistration(options)

            // 3. Send the response to the server for verification
            const verificationResp = await fetch(`${VITE_APP_LOCAL_API}/webauthn/register/finish`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId,
                    response: attResp,
                }),
            })

            const verificationJSON = await verificationResp.json()

            if (verificationJSON && verificationJSON.verified) {
                setEncodeUser({
                    email: user.email,
                    password: "",
                })
            }
        } catch (error: any) {
            console.error(error)
        }
    }

    const getAuthnToken = async (): Promise<string | undefined> => {
        const user = getDecodeUser()
        const email = user?.email || ""
        if (!email) {
            throw new Error("Por favor, ingresa tu correo electrónico para usar el inicio de sesión biométrico.")
            return
        }

        try {
            // 1. Get options from server
            const beginResponse = await fetch(`${VITE_APP_LOCAL_API}/webauthn/authenticate/begin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            if (!beginResponse.ok) {
                const error = await beginResponse.json()
                throw new Error(error.message || "Error al obtener opciones de autenticación")
            }

            const { options } = await beginResponse.json()

            if (options.allowCredentials && options.allowCredentials.length === 0) {
                throw new Error("No tienes un método de inicio de sesión biométrico registrado para este correo.")
                return
            }

            // 2. Start authentication with browser
            const authResponse = await startAuthentication(options)

            // 3. Verify authentication with server
            const finishResponse = await fetch(`${VITE_APP_LOCAL_API}/webauthn/authenticate/finish`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    response: authResponse,
                    expectedChallenge: options.challenge,
                }),
            })

            const verificationData = await finishResponse.json()

            if (finishResponse.ok && verificationData.verified && verificationData.token) {
                return verificationData.token || ""
            } else {
                throw new Error(verificationData.message || "La verificación biométrica falló")
            }
        } catch (error: any) {
            console.log(error)
            if (error.name === "NotAllowedError" || error.name === "AbortError") {
                throw new Error("El inicio de sesión biométrico fue cancelado.")
            } else {
                throw new Error("No se pudo completar el inicio de sesión. Inténtalo de nuevo.")
            }
        }
    }

    const handleRegister = (value: User) => {
        const user = getDecodeUser()
        if (user?.email !== value.email) {
            setRegisterBiometric(value)
        }
    }

    return {
        isRegisteredBiometric: getStorageKey(),
        setRegisterUser: (v: User) => handleRegister(v),
        getAuthnToken,
    }
}
