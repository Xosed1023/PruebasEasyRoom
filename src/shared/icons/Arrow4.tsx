import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Arrow4 = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 37 24" fill="none" {...rest}>
            <path
                d="M36.283 13.139a1.61 1.61 0 000-2.278L26.036.614a1.61 1.61 0 10-2.277 2.278L32.867 12l-9.108 9.108a1.61 1.61 0 002.277 2.277L36.283 13.14zM.037 13.61h35.107v-3.22H.037v3.22z"
                fill={color}
            />
        </svg>
    )
})

export default Arrow4
