import aes from "crypto-js/aes"
import enc from "crypto-js/enc-utf8"
import { VITE_APP_AUTHN_KEY, VITE_APP_USER_KEY } from "@/config/environment"

type Key = {
    email: string
    password: string
}

interface User extends Key {
    user_id: string
}

export function useBiometricAuth() {
    const getEncodeKey = (key: Key): Uint8Array<ArrayBuffer> => {
        return Uint8Array.from(JSON.stringify(key), (c) => c.charCodeAt(0))
    }

    const getStorageKey = () => {
        return localStorage.getItem(VITE_APP_AUTHN_KEY)
    }

    const setEncodeUser = (key: Key) => {
        const value = aes.encrypt(JSON.stringify(key), VITE_APP_USER_KEY).toString()
        localStorage.setItem(VITE_APP_AUTHN_KEY, value)

        return
    }

    const getDecodeUser = (): Key => {
        const key = getStorageKey()
        const bytes = aes.decrypt(key, VITE_APP_USER_KEY)
        const data = JSON.parse(bytes.toString(enc))
        return data
    }

    const getRegistration = () =>
        navigator.credentials.get({
            publicKey: {
                challenge: new Uint8Array(32),
                rpId: window.location.hostname,
                allowCredentials: [],
                userVerification: "required",
            },
        })

    const setRegisterBiometric = async (user: User): Promise<Key | undefined> => {
        try {
            if (!window.PublicKeyCredential) {
                //alert("Tu navegador no soporta autenticación biométrica")
                return
            }

            const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
            if (!available) {
                //alert("La autenticación biométrica no está disponible en este dispositivo")
                return
            }

            const challenge = new Uint8Array(32)
            window.crypto.getRandomValues(challenge)

            const { email, password } = user
            const userObj = { email, password }

            const keycode = getEncodeKey(userObj)

            const createCredentialOptions = {
                publicKey: {
                    challenge,
                    rp: {
                        name: "easyroom-mobile",
                        id: window.location.hostname,
                    },
                    user: {
                        id: keycode,
                        name: email,
                        displayName: "Easyroom Key",
                    },
                    pubKeyCredParams: [
                        {
                            type: "public-key" as any,
                            alg: -7, // ES256
                        },
                    ],
                    timeout: 60000,
                    authenticatorSelection: {
                        authenticatorAttachment: "platform" as any,
                        userVerification: "required" as any,
                        residentKey: "required" as any,
                    },
                },
            }

            const credential = await navigator.credentials.create(createCredentialOptions)

            if (credential) {
                setEncodeUser(userObj)
                return userObj
            }

            return
        } catch (e) {
            console.log(e)
            return
        }
    }

    const getVerifyBiometric = async (): Promise<Key | undefined> => {
        try {
            const challenge = new Uint8Array(32)
            window.crypto.getRandomValues(challenge)

            const getCredentialOptions = {
                publicKey: {
                    challenge,
                    rpId: window.location.hostname,
                    userVerification: "required" as any,
                    timeout: 60000,
                },
            }

            const credential = await navigator.credentials.get(getCredentialOptions)

            if (credential) {
                const values = getDecodeUser()
                return values
            }

            return
        } catch (e) {
            console.log(e)
            return
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
        getRegistration,
        setRegisterBiometric: (v: User) => handleRegister(v),
        getVerifyBiometric,
    }
}
