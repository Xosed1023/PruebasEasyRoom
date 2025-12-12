import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const SerachLg = memo(({ color = "#667085", ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...rest}>
            <path
                d="M16.5 16.5L13.5834 13.5833M15.6667 8.58333C15.6667 12.4954 12.4954 15.6667 8.58333 15.6667C4.67132 15.6667 1.5 12.4954 1.5 8.58333C1.5 4.67132 4.67132 1.5 8.58333 1.5C12.4954 1.5 15.6667 4.67132 15.6667 8.58333Z"
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
})

export default SerachLg
