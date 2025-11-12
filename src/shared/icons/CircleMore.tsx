import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const CircleMore = memo(({ ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" fill="none" viewBox="0 0 14 18" {...rest}>
            <circle cx={7} cy={9} r={7} fill="#D4C1FF" />
            <path fill="#6941C6" d="M9.676 8.748v1.47H3.828v-1.47h5.848ZM7.555 6.434v6.21h-1.6v-6.21h1.6Z" />
        </svg>
    )
})

export default CircleMore
