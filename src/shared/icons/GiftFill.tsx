import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const GiftFill = memo((props: IconProps) => {
    const { color = "var(--header)", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...rest}>
            <path
                fill={color}
                d="M13 1.667a3.334 3.334 0 0 1 2.887 5h3.78v1.666h-1.666v8.333a.833.833 0 0 1-.834.834H3.834a.834.834 0 0 1-.833-.834V8.333H1.334V6.667h3.78a3.333 3.333 0 0 1 5.387-3.871 3.319 3.319 0 0 1 2.5-1.13Zm-1.666 6.666H9.667v8.333h1.667V8.333Zm-3.333-5a1.667 1.667 0 0 0-.125 3.33L8 6.666h1.666V5a1.667 1.667 0 0 0-1.414-1.648l-.128-.015L8 3.333Zm5 0a1.667 1.667 0 0 0-1.663 1.542L11.334 5v1.667h1.667a1.667 1.667 0 0 0 1.662-1.542L14.667 5a1.667 1.667 0 0 0-1.666-1.667Z"
            />
        </svg>
    )
})

export default GiftFill
