import { memo } from "react"
import { IconProps } from "./Icon.type"

const EyeOff = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7.162 3.395c.27-.04.55-.062.838-.062 3.404 0 5.637 3.004 6.387 4.192.09.143.136.215.162.326a.784.784 0 0 1 0 .298c-.026.11-.071.183-.163.328-.2.316-.505.761-.908 1.243M4.483 4.477c-1.441.977-2.42 2.336-2.869 3.047-.091.144-.137.216-.162.327a.782.782 0 0 0 0 .298c.025.11.07.183.161.326.75 1.188 2.984 4.192 6.387 4.192 1.373 0 2.555-.489 3.526-1.15M2 2l12 12M6.586 6.586a2 2 0 0 0 2.828 2.828"
            />
        </svg>
    )
})

export default EyeOff
