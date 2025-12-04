import { memo } from "react"
import { IconProps } from "./Icon.type"

const AlertLine = memo((props: IconProps) => {
    const { color = "#BEBEBE", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 25" fill="none" {...rest}>
            <path
                fill={color}
                d="m12.865 3.047 9.526 16.5a1 1 0 0 1-.866 1.5H2.473a1 1 0 0 1-.866-1.5l9.526-16.5a1 1 0 0 1 1.732 0Zm-8.66 16h15.588l-7.794-13.5-7.794 13.5Zm6.794-3h2v2h-2v-2Zm0-7h2v5h-2v-5Z"
            />
        </svg>
    )
})

export default AlertLine
