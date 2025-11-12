import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const UsersParentSingle = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 17 16" fill="none" {...rest}>
            <path
                d="M8.167 7.333a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0 .667a3.333 3.333 0 0 1 3.334 3.333V14H4.834v-2.667A3.333 3.333 0 0 1 8.167 8Z"
                fill={color}
            />
        </svg>
    )
})

export default UsersParentSingle
