import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const ComputerFill = memo((props: IconProps) => {
    const { color = "#fff", ...rest } = props
    return (
        <svg width="1em" height="1em" fill="none" viewBox="0 0 16 16" {...rest}>
            <path
                fill={color}
                d="M8.666 12v1.333h2.667v1.334H4.666v-1.334h2.667V12H1.994a.664.664 0 0 1-.661-.671V2.67c0-.37.303-.671.661-.671h12.011c.365 0 .661.3.661.671v8.658c0 .37-.303.671-.661.671H8.666Z"
            />
        </svg>
    )
})

export default ComputerFill
