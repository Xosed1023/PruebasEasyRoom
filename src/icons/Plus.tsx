import { memo } from "react"
import { IconProps } from "./Icon.type"

const Plus = memo((props: IconProps) => {
    const { color = "#000", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" {...rest}>
            <path stroke={color} strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
        </svg>
    )
})

export default Plus
