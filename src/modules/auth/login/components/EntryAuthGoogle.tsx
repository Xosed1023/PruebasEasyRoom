import { useEffect } from "react"
import { GoogleLoginResponseOnline, SocialLogin } from "@capgo/capacitor-social-login"
import { AuthGoogleParams } from "../Login.type"
import SocialGoogle from "@/icons/SocialGoogle"
import { VITE_APP_GOOGLE_OAUTH_IOS_API_CLIENT_ID, VITE_APP_GOOGLE_OAUTH_WEB_API_CLIENT_ID } from "@/config/environment"

type EntryAuthGoogleProps = {
    onAuth: (res: AuthGoogleParams) => void
    className: string
}

function EntryAuthGoogle({ className = "", onAuth }: EntryAuthGoogleProps) {
    useEffect(() => {
        const handle = async () => {
            await SocialLogin.initialize({
                google: {
                    webClientId: VITE_APP_GOOGLE_OAUTH_WEB_API_CLIENT_ID,
                    iOSClientId: VITE_APP_GOOGLE_OAUTH_IOS_API_CLIENT_ID,
                    iOSServerClientId: VITE_APP_GOOGLE_OAUTH_WEB_API_CLIENT_ID,
                    mode: "online",
                },
            })
        }

        handle()
    }, [])

    const handleLogin = async () => {
        try {
            const response = await SocialLogin.login({
                provider: "google",
                options: {
                    scopes: ["email", "profile"],
                },
            })

            console.log({ response })

            if (!response.result) return

            const result = response.result as GoogleLoginResponseOnline
            onAuth({ client_id: VITE_APP_GOOGLE_OAUTH_WEB_API_CLIENT_ID, credential: result?.idToken || "" })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className={className} onClick={handleLogin}>
            <SocialGoogle height={20} width={20} />
            <span>{"Sign in with Google"}</span>
        </div>
    )
}

export default EntryAuthGoogle
