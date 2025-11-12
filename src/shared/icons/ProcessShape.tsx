import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const ProcessShape = memo((props: IconProps) => {
    const { color = "var(--tipografa)", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 15 16" fill="none" {...rest}>
            <path
                fill={color}
                d="M14.667 3.667v9.952a2.098 2.098 0 0 1-2.096 2.095H2.095A2.098 2.098 0 0 1 0 13.62V.524A.524.524 0 0 1 .524 0h2.095a.524.524 0 0 1 .524.524v5.438L8.67 3.198a.524.524 0 0 1 .759.469v2.218l4.444-2.667a.523.523 0 0 1 .794.449ZM4.19 9.429H2.095v2.095H4.19V9.429Zm4.19 0H6.287v2.095H8.38V9.429Zm4.191 0h-2.095v2.095h2.095V9.429Z"
            />
        </svg>
    )
})

export default ProcessShape
