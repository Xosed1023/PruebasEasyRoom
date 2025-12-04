import { memo } from "react"
import { IconProps } from "./Icon.type"

const AlertLine = memo((props: IconProps) => {
    const { color = "#fff", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 19" fill="none" {...rest}>
            <path
                fill={color}
                d="m10.687 2.376 7.541 13.063a.791.791 0 0 1-.686 1.187H2.46a.791.791 0 0 1-.686-1.187L9.315 2.376a.792.792 0 0 1 1.372 0ZM9.209 12.668v1.583h1.584v-1.583H9.209Zm0-5.542v3.959h1.584V7.126H9.209Z"
            />
        </svg>
    )
})

export default AlertLine
