import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Logout = memo(({ color = "#fff", ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...rest}>
            <path
                d="M10 10.988H4V2.997a.998.998 0 011-1h14a1 1 0 011 1v17.98a.999.999 0 01-1 .999H5a1 1 0 01-1-.999v-7.991h6v2.996l5-3.995-5-3.996v2.997z"
                fill={color}
            />
        </svg>
    )
})

export default Logout
