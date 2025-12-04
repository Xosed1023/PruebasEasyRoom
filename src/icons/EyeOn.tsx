import { memo } from "react"
import { IconProps } from "./Icon.type"

const EyeOn = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1.613 8.476c-.09-.144-.136-.216-.161-.326a.782.782 0 0 1 0-.298c.025-.111.07-.183.161-.327C2.363 6.337 4.597 3.334 8 3.334c3.404 0 5.637 3.003 6.387 4.191.09.144.136.216.162.327.019.083.019.214 0 .298-.026.11-.071.182-.162.326-.75 1.188-2.983 4.191-6.387 4.191-3.403 0-5.636-3.003-6.387-4.19Z"
            />
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
            />
        </svg>
    )
})

export default EyeOn
