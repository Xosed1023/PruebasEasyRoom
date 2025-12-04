import { memo } from "react"
import { IconProps } from "./Icon.type"

const Trash = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.58}
                d="M6 2h4M2 4h12m-1.333 0-.468 7.013c-.07 1.052-.105 1.578-.332 1.977a2 2 0 0 1-.866.81c-.413.2-.94.2-1.995.2H6.994c-1.055 0-1.582 0-1.995-.2a2 2 0 0 1-.866-.81c-.227-.399-.262-.925-.332-1.977L3.333 4m3.334 3v3.333M9.333 7v3.333"
            />
        </svg>
    )
})

export default Trash
