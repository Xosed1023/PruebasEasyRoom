import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const CupFill = memo((props: IconProps) => {
    const { color = "var(--header)", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 21 20" fill="none" {...rest}>
            <path
                fill={color}
                d="M4.666 2.5h12.5a1.667 1.667 0 0 1 1.667 1.667v2.5a1.667 1.667 0 0 1-1.667 1.666h-1.667v2.5a3.333 3.333 0 0 1-3.333 3.334h-5a3.333 3.333 0 0 1-3.333-3.334v-7.5a.833.833 0 0 1 .833-.833Zm10.833 1.667v2.5h1.667v-2.5h-1.667ZM2.166 15.833h15V17.5h-15v-1.667Z"
            />
        </svg>
    )
})

export default CupFill
