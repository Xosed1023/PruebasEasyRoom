import { VITE_FORGOT_KEY } from "@/config/encrypt"
import aes from "crypto-js/aes"

export function getStringEncrypt(data: any) {
    return aes.encrypt(JSON.stringify(data), VITE_FORGOT_KEY).toString()
}
