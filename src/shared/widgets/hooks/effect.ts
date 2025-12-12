import { useEffect } from "react"
import { useDrawerWidget } from "./drawer"

export function useComponentLoad(onEvent: () => void) {
    const { visible } = useDrawerWidget()

    useEffect(() => {
        if (visible) onEvent()
    }, [visible])
}
