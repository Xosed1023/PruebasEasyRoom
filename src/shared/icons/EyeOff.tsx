import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const EyeOff = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...rest}>
            <path
                d="M4.52 5.934L1.393 2.808l1.415-1.415 19.8 19.8-1.416 1.414-3.31-3.31A10.95 10.95 0 0112 21c-5.392 0-9.878-3.88-10.819-9a10.982 10.982 0 013.34-6.066zm10.237 10.238l-1.464-1.464a3 3 0 01-4-4L7.827 9.242a5 5 0 006.93 6.93zM7.974 3.76A10.99 10.99 0 0112 3c5.392 0 9.878 3.88 10.82 9a10.95 10.95 0 01-2.013 4.592l-3.86-3.86a5.001 5.001 0 00-5.68-5.68l-3.293-3.29V3.76z"
                fill={color}
            />
        </svg>
    )
})

export default EyeOff
