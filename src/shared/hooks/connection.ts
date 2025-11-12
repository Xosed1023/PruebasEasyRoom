import { useEffect, useState } from "react"

export function useListenerConnection() {
    const [onLine, setOnline] = useState<boolean>(navigator.onLine)

    const handleOnline = () => {
        setOnline(true)
    }

    const handleOffline = () => {
        setOnline(false)
    }

    useEffect(() => {
        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [])

    return {
        onLine,
    }
}
