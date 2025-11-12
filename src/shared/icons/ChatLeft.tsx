import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const ChatLeft = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <path d="m4.86 13.883-3.527.784.784-3.527a6.667 6.667 0 1 1 2.743 2.743Z" fill={color} />
        </svg>
    )
})

export default ChatLeft
