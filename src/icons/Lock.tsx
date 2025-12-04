import { memo } from "react"
import { IconProps } from "./Icon.type"

const Lock = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...rest}>
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.165 9.167v-2.5a4.167 4.167 0 0 0-8.333 0v2.5m1.5 8.333h5.333c1.4 0 2.1 0 2.635-.273a2.5 2.5 0 0 0 1.093-1.092c.272-.535.272-1.235.272-2.635v-.333c0-1.4 0-2.1-.272-2.635A2.5 2.5 0 0 0 15.3 9.439c-.534-.272-1.235-.272-2.635-.272H7.332c-1.4 0-2.1 0-2.635.272a2.5 2.5 0 0 0-1.092 1.093c-.273.534-.273 1.235-.273 2.635v.333c0 1.4 0 2.1.273 2.635a2.5 2.5 0 0 0 1.092 1.092c.535.273 1.235.273 2.635.273Z"
            />
        </svg>
    )
})

export default Lock
