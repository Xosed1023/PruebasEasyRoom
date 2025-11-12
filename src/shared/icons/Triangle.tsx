import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Triangle = memo((props: IconProps) => {
    const { color = "#408232", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 8 5" fill="none" {...rest}>
            <path fill={color} d="m4.412.823 3.53 3.53H.882l3.53-3.53Z" />
        </svg>
    )
})

export default Triangle
