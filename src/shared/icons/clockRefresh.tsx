import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const ClockRefresh = memo(({ color = "#000", ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <path
                d="M13.636 8.595a5.667 5.667 0 01-10.543 2.238l-.167-.288m-.562-3.14a5.667 5.667 0 0110.543-2.238l.167.288M2.329 12.044l.488-1.821 1.821.488m6.723-5.422l1.822.488.488-1.821M8 5v3l1.666 1"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
})

export default ClockRefresh
