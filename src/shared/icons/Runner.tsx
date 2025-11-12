import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Runner = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 18 20" fill="none" {...rest}>
            <path
                d="M6.004 7.419l2.797-2.032c.314-.23.696-.348 1.085-.335a2.283 2.283 0 012.118 1.588c.162.509.31.853.445 1.032a4.357 4.357 0 003.489 1.743v1.746a6.097 6.097 0 01-4.715-2.223l-.608 3.451 1.799 1.51 1.94 5.33-1.641.597-1.78-4.89-2.959-2.483a1.745 1.745 0 01-.622-1.662l.444-2.517-.59.43-1.857 2.554-1.412-1.026L5.99 7.408l.015.01zm5.134-2.803a1.745 1.745 0 110-3.491 1.745 1.745 0 010 3.49zM8.544 16.118L5.74 19.461l-1.337-1.122L7 15.245l.65-1.903 1.564 1.31-.67 1.466z"
                fill={color}
            />
        </svg>
    )
})

export default Runner
