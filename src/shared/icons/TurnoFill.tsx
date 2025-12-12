import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const TurnoFill = memo((props: IconProps) => {
    const { color = "var(--primary)", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 26 24" fill="none" {...rest}>
            <path
                fill={color}
                d="M24.25.875a1.25 1.25 0 0 1 1.25 1.25V9a3.125 3.125 0 1 0 0 6.25v6.875a1.25 1.25 0 0 1-1.25 1.25H1.75a1.25 1.25 0 0 1-1.25-1.25V15.25A3.125 3.125 0 1 0 .5 9V2.125A1.25 1.25 0 0 1 1.75.875h22.5Z"
            />
        </svg>
    )
})

export default TurnoFill
