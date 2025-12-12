import { RefObject, useEffect, useState } from "react"

const useDescription = ({ description, ref }: { description?: string; ref: RefObject<HTMLSpanElement> }) => {
    const [descriptionWidth, setdescriptionWidth] = useState(0)

    useEffect(() => {
        if (!ref.current || !description) {
            return
        }
        const width = ref.current.getBoundingClientRect().width
        setdescriptionWidth(width)
    }, [description, ref])

    return {
        descriptionWidth,
    }
}

export default useDescription
