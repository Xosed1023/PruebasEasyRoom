import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const MoreFill = memo((props: IconProps) => {
    const { color = "#FFF", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 18 4" fill="none" {...rest}>
            <path
                fill={color}
                d="M2 0C.9 0 0 .9 0 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM9 0C7.9 0 7 .9 7 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"
            />
        </svg>
    )
})

export default MoreFill
