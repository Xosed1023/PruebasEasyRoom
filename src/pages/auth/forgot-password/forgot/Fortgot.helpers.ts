import aes from "crypto-js/aes"
import { REACT_AUTH_KEY } from "src/config/encrypt"

export function getStringEncrypt(data: any) {
    return aes.encrypt(JSON.stringify(data), REACT_AUTH_KEY).toString()
}
