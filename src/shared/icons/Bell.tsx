import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Bell = memo((props: IconProps) => {
    const { color = "#000", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 18 16" fill="none" {...rest}>
            <path
                fill={color}
                d="M16.07 10.286c.217-.002.432.02.644.064v-.064a7.714 7.714 0 0 0-7.072-7.682V1.286h.643a.643.643 0 1 0 0-1.286H7.714a.643.643 0 1 0 0 1.286h.643v1.318a7.714 7.714 0 0 0-7.072 7.682v.064c.212-.044.427-.066.643-.064h14.143ZM16.071 11.848H1.93a1.928 1.928 0 1 0 0 3.857H16.07a1.928 1.928 0 1 0 0-3.857Z"
            />
        </svg>
    )
})

export default Bell
