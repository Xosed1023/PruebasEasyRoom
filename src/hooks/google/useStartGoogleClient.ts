import { useEffect, useRef } from "react"
import { VITE_APP_GOOGLE_OAUTH_API_CLIENT_ID } from "src/config/environment"

export const useStartGoogleClient = ({
    handleGoogleLoginSuccess,
    handleGoogleRegisterSuccess,
    googleButtonId,
    text,
}: {
    handleGoogleLoginSuccess?: (response: any) => void
    handleGoogleRegisterSuccess?: (response: any) => void
    googleButtonId: string
    text: "signin_with" | "signup_with" | "continue_with" | "signin" | undefined
}) => {
    const retryCountRef = useRef(0)
    const maxRetries = 50 // 5 seconds max wait time

    useEffect(() => {
        const initializeGoogleAuth = () => {
            // Check if google object is available
            if (typeof window === 'undefined') {
                return
            }

            // Check if google script is loaded
            if (typeof (window as any).google === 'undefined' || !(window as any).google?.accounts) {
                retryCountRef.current++
                
                if (retryCountRef.current < maxRetries) {
                    // If not available, wait and try again
                    setTimeout(initializeGoogleAuth, 100)
                    return
                } else {
                    console.warn('Google API failed to load after maximum retries')
                    return
                }
            }

            try {
                const google = (window as any).google

                google.accounts.id.initialize({
                    client_id: VITE_APP_GOOGLE_OAUTH_API_CLIENT_ID || "",
                    callback: handleGoogleLoginSuccess || handleGoogleRegisterSuccess,
                    ux_mode: "popup",
                })

                const buttonElement = document.getElementById(googleButtonId)
                if (buttonElement) {
                    google.accounts.id.renderButton(buttonElement, {
                        theme: "outline",
                        size: "large",
                        type: "standard",
                        width: 370,
                        text,
                    })
                }
            } catch (error) {
                console.error('Error initializing Google Auth:', error)
            }
        }

        // Reset retry count on new initialization
        retryCountRef.current = 0
        
        // Start initialization
        initializeGoogleAuth()
    }, [handleGoogleLoginSuccess, handleGoogleRegisterSuccess, googleButtonId, text])
}
