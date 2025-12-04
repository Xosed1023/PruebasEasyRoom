import aes from "crypto-js/aes"
import enc from "crypto-js/enc-utf8"
import { VITE_FORGOT_KEY } from "@/config/encrypt"
import { ObjectResponse } from "./ChangePassword.types"

export function getObjectDecode(key: string): ObjectResponse {
    const defaultResponse = {
        userId: null,
        email: null,
        expired_at: 0,
    }

    try {
        if (key) {
            const bytes = aes.decrypt(key, VITE_FORGOT_KEY)
            const data = JSON.parse(bytes.toString(enc))
            return {
                user_id: data?.user_id,
                email: data?.email,
                expired_at: new Date(data?.expired_at).getTime(),
            }
        } else {
            return defaultResponse
        }
    } catch (e) {
        console.log(e)
        return defaultResponse
    }
}

export const handleFormat = (text: string) => {
    return text ? text.replace(/\s/g, "").trim() : ""
}
