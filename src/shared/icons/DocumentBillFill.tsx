import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const DocumentBillFill = memo((props: IconProps) => {
    const { color = "var(--tipografa)", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 17 16" fill="none" {...rest}>
            <path
                fill={color}
                d="M13.833 14.67H3.167a.667.667 0 0 1-.667-.667v-12a.667.667 0 0 1 .667-.667h10.666a.667.667 0 0 1 .667.667v12a.666.666 0 0 1-.667.666Zm-8-8.667v1.333h5.334V6.003H5.833Zm0 2.666v1.334h5.334V8.669H5.833Z"
            />
        </svg>
    )
})

export default DocumentBillFill
