import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const CircleEqual = memo(({ ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" fill="none" viewBox="0 0 14 18" {...rest}>
            <circle cx={7} cy={9} r={7} fill="#D4C1FF" />
            <path
                fillRule={"evenodd"}
                fill="#6941C6"
                d="M9.553 7.258v1.336H4.297V7.258h5.256Zm0 2.531v1.336H4.297V9.789h5.256Z"
            />
        </svg>
    )
})

export default CircleEqual
