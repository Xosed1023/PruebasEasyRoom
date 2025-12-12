import { useEffect } from "react"

const useSubmitEvent = ({ onEvent }: { onEvent: () => void }) => {
    useEffect(() => {
        window.addEventListener("submitSupervision", onEvent)

        return () => {
            window.removeEventListener("submitSupervision", onEvent)
        }
    }, [onEvent])
}

export default useSubmitEvent

export const dispatchSubmitEvent = () => {
    const event = new CustomEvent("submitSupervision")
    dispatchEvent(event)
}
