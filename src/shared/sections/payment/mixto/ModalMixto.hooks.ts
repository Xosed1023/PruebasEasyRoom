import { useMemo } from "react"

type Size =  "xs" | "sm" | "md" | "lg"

export function useModalSize(fields: number): Size {
    return useMemo(() => {
        let size: Size = "xs" 

        if (fields > 1) {
            size = "sm"
        }
        if (fields > 2) { 
            if (fields === 3) size = "md"
            if (fields === 4) size = "lg"
        }

        return size
    }, [fields])
}
