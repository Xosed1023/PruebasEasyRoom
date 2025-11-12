import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const OptionsGroup = memo(({ color = "#667085", ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 22 23" fill="none" {...rest}>
            <rect width="4.4" height="4.4" transform="matrix(1 0 0 -1 0 4.90039)" fill={color} />
            <rect width="4.4" height="4.4" transform="matrix(1 0 0 -1 0 13.6992)" fill={color} />
            <rect width="4.4" height="4.4" transform="matrix(1 0 0 -1 0 22.5)" fill={color} />
            <rect width="4.4" height="4.4" transform="matrix(1 0 0 -1 8.80078 4.90039)" fill={color} />
            <rect width="4.4" height="4.4" transform="matrix(1 0 0 -1 8.80078 13.6992)" fill={color} />
            <rect width="4.4" height="4.4" transform="matrix(1 0 0 -1 8.80078 22.5)" fill={color} />
            <rect width="4.4" height="4.4" transform="matrix(1 0 0 -1 17.6016 4.90039)" fill={color} />
            <rect width="4.4" height="4.4" transform="matrix(1 0 0 -1 17.6016 13.6992)" fill={color} />
            <rect width="4.4" height="4.4" transform="matrix(1 0 0 -1 17.6016 22.5)" fill={color} />
        </svg>
    )
})

export default OptionsGroup
