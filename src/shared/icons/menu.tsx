import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Menu = memo((props: IconProps) => {
    const { color = "#000", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 32 32" fill="none" {...rest}>
            <path fill={color} d="M4 5.333h24V8H4V5.333Zm0 9.334h24v2.666H4v-2.666ZM4 24h24v2.667H4V24Z" />
        </svg>
    )
})

export default Menu
