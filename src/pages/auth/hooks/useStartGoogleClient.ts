import { useEffect } from "react"
import { REACT_APP_GOOGLE_OAUTH_API_CLIENT_ID } from "src/config/environment"

export const useStartGoogleClient = ({
    handleLoginSuccess,
    handleGoogleRegisterSuccess,
    googleButtonId,
    text,
}: {
    handleLoginSuccess?: (response: google.accounts.id.CredentialResponse) => void
    handleGoogleRegisterSuccess?: (response: google.accounts.id.CredentialResponse) => void,
    googleButtonId: string
    text: "signin_with" | "signup_with" | "continue_with" | "signin" | undefined
}) => {
    useEffect(() => {
        // global google
        if(!google) {
            return
        }
        google.accounts.id.initialize({
            client_id: REACT_APP_GOOGLE_OAUTH_API_CLIENT_ID || "",
            callback: handleLoginSuccess || handleGoogleRegisterSuccess,
            ux_mode: "popup",
        })

        google.accounts.id.renderButton(document.getElementById(googleButtonId) || new HTMLElement(), {
            theme: "outline",
            size: "large",
            type: "standard",
            width: 370,
            text,
        })
    }, [])
}
