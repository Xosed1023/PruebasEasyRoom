import { useEffect } from "react"

interface UseKeyDownProps {
    key: KeyboardEvent["key"]
    onEvent: () => void
}

const useKeyDown = ({ onEvent, key }: UseKeyDownProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            event?.preventDefault()
            if (event.key === key) {
                onEvent()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [onEvent])
}

export default useKeyDown