import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Phone = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 17" fill="none" {...rest}>
            <path
                fill={color}
                d="M12.188 8.947v2.357a.667.667 0 0 1-.62.665c-.292.02-.53.031-.714.031C4.963 12 .188 7.225.188 1.333c0-.184.01-.422.03-.713A.667.667 0 0 1 .883 0h2.358a.333.333 0 0 1 .332.3c.015.153.03.275.042.368.133.925.404 1.824.806 2.667a.304.304 0 0 1-.098.378L2.884 4.741a8.698 8.698 0 0 0 4.563 4.563l1.026-1.436a.308.308 0 0 1 .382-.1 9.268 9.268 0 0 0 3.034.847.333.333 0 0 1 .3.332h-.002Z"
            />
        </svg>
    )
})

export default Phone
