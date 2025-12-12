import { useEffect } from "react"

interface UseEscapeKeyProps {
    onEscape: () => void
}

const useEscapeKey = ({ onEscape }: UseEscapeKeyProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onEscape()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [onEscape])
}

export default useEscapeKey
