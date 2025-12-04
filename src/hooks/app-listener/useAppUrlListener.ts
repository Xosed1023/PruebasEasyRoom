import { useEffect } from "react"
import { useNavigate } from "react-router"
import { App, URLOpenListenerEvent } from "@capacitor/app"
import { VITE_APP_WEB_URL } from "@/config/environment"

export function useAppUrlListener() {
    const navigate = useNavigate()
    useEffect(() => {
        App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
            console.log({ event })
            const slug = event.url.split(".app").pop() || ""
            const path = slug.split(VITE_APP_WEB_URL)?.[1] || ""
            console.log({ path })
            if (path) {
                navigate(path)
            }
        })
    }, [])
}
