import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Image = memo((props: IconProps) => {
    const { color = "var(--tipografa)", ...rest } = props
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 183 165" fill="none" {...rest}>
            <path
                fill={color}
                d="M164.5 18.625h-146v127.75l84.789-84.808a9.127 9.127 0 0 1 12.903 0l48.308 48.399V18.625ZM.25 9.436A9.125 9.125 0 0 1 9.302.375h164.396c5.001 0 9.052 4.06 9.052 9.061v146.128a9.124 9.124 0 0 1-9.052 9.061H9.302a9.06 9.06 0 0 1-9.052-9.061V9.436ZM55 73.375a18.25 18.25 0 1 1 0-36.5 18.25 18.25 0 0 1 0 36.5Z"
            />
        </svg>
    )
})

export default Image
