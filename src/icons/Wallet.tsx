import { memo } from "react"
import { IconProps } from "./Icon.type"

const Wallet = memo((props: IconProps) => {
    const { color = "#BEBEBE", secondarycolor = "", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 25" fill="none" {...rest}>
            <path
                fill={secondarycolor}
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M22 12.25v5c0 3-2 5-5 5H7c-3 0-5-2-5-5v-5c0-2.72 1.64-4.62 4.19-4.94.26-.04.53-.06.81-.06h10c.26 0 .51.01.75.05 2.58.3 4.25 2.21 4.25 4.95Z"
            />
            <path
                fill={secondarycolor}
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.751 7.3c-.24-.04-.49-.05-.75-.05h-10c-.28 0-.55.02-.81.06.14-.28.34-.54.58-.78l3.25-3.26a3.525 3.525 0 0 1 4.96 0l1.75 1.77c.64.63.98 1.43 1.02 2.26ZM22 12.75h-3c-1.1 0-2 .9-2 2s.9 2 2 2h3"
            />
        </svg>
    )
})

export default Wallet
