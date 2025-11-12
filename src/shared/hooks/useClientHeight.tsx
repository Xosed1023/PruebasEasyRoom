import { useState, useEffect } from "react"

function getClientHeightWithChildren(element: HTMLElement, children?: (HTMLElement | null)[]): number {
    const elementHeight = element.clientHeight

    if (!children || children.length === 0) {
        return elementHeight
    }

    const childrenHeight = children.reduce((totalHeight, child) => {

        if (child) {
            return totalHeight + child.clientHeight
        }
        return 0
    }, 0)

    return elementHeight - childrenHeight
}

export function useClientHeightWithChildren(
    elementRef: React.RefObject<HTMLElement>,
    childRefs?: React.RefObject<HTMLElement>[]
): number {
    const [clientHeight, setClientHeight] = useState<number>(0)

    useEffect(() => {
        const element = elementRef.current
        const children = childRefs?.map((ref) => ref.current)

        if (element) {
            const updatedHeight = getClientHeightWithChildren(element, children)
            setClientHeight(updatedHeight)
        }
    }, [])

    return clientHeight
}
