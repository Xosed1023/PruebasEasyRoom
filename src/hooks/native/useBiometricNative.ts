import aes from "crypto-js/aes"
import enc from "crypto-js/enc-utf8"
import { Capacitor } from "@capacitor/core"
import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric"
import { VITE_APP_USER_KEY, VITE_APP_AUTHN_KEY } from "@/config/environment"

const server = Capacitor.getPlatform() === "ios" ? "io.easyroom.mobile" : "easyroom.io"

const user_key = VITE_APP_USER_KEY || "credential-easyroom"
const authn_key = VITE_APP_AUTHN_KEY || "@biometric-key"

type Key = {
    email: string
    password: string
}

interface User extends Key {
    user_id: string
}

export function useBiometricNative() {
    const getStorageKey = () => {
        return localStorage.getItem(authn_key)
    }

    const setEncodeUser = (key: Key) => {
        const value = aes.encrypt(JSON.stringify(key), user_key).toString()
        localStorage.setItem(authn_key, value)

        return
    }

    const getDecodeUser = (): Key | undefined => {
        const key = getStorageKey()
        if (key) {
            const bytes = aes.decrypt(key, user_key)
            const data = JSON.parse(bytes.toString(enc))
            return data
        }

        return
    }

    const removeRegisterBiometric = () => {
        const key = getStorageKey()
        if (key) {
            NativeBiometric.deleteCredentials({ server })
                .then(() => {
                    localStorage.removeItem(authn_key)
                })
                .catch((e) => {
                    console.log(e)
                })
        }

        return
    }

    const setRegisterBiometric = (user: User) => {
        const userId = user.user_id
        if (!userId) {
            return
        }

        NativeBiometric.setCredentials({
            username: user.email,
            password: user.password,
            server,
        })
            .then(() => {
                setEncodeUser({
                    email: user.email,
                    password: user.password,
                })
            })
            .catch((e: any) => {
                console.log(e)
            })
    }

    const getVerifyBiometric = async (): Promise<Key | undefined> => {
        const user = getDecodeUser()
        const email = user?.email || ""

        if (!email) {
            throw new Error("Por favor, ingresa tu correo electrónico para usar el inicio de sesión biométrico.")
            return
        }
        try {
            const result = await NativeBiometric.isAvailable()

            if (!result.isAvailable) return

            const isFaceID = result.biometryType == BiometryType.FACE_ID

            console.log(isFaceID)

            const verified = await NativeBiometric.verifyIdentity({
                reason: "Para iniciar sesión rápido",
                title: "Verifica con tu huella digital",
                subtitle: "Easyroom",
                description:
                    "Utiliza tu huella digital para iniciar sesión de forma rápida y segura en esta aplicación.",
            })
                .then(() => true)
                .catch(() => false)

            if (!verified) return

            const credentials = await NativeBiometric.getCredentials({
                server,
            })

            if (credentials) {
                return {
                    email: credentials.username,
                    password: credentials.password,
                }
            }
        } catch (error: any) {
            console.log(error)
            throw new Error("Por favor, registra tus biométrico en tu dispositivo para usar el inicio de sesión.")
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
        setRegisterBiometric: (v: User) => handleRegister(v),
        getVerifyBiometric,
        removeRegisterBiometric,
    }
}
