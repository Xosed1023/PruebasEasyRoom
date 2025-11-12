import { useEffect } from "react"
import { useStatusRS } from "src/shared/hooks/useStatusRS"

export function useRSNavigate(products: number) {
    const { setDirty, ...rest } = useStatusRS()

    useEffect(() => {
        setDirty(products > 0)
    }, [products])

    return {
        ...rest,
    }
}
