import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Printer = memo((props: IconProps) => {
    const { color = "var(--white)", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 17 16" fill="none" {...rest}>
            <path
                fill={color}
                d="M5.005 11.332h6.667v3.333H5.005v-3.333Zm8 2V9.999H3.672v3.333H2.339a.667.667 0 0 1-.667-.667V6a.667.667 0 0 1 .667-.667h12a.666.666 0 0 1 .666.667v6.666a.667.667 0 0 1-.667.667h-1.333ZM3.672 6.665V8h2V6.665h-2Zm1.333-5.333h6.667a.667.667 0 0 1 .666.667v2h-8v-2a.667.667 0 0 1 .667-.667Z"
            />
        </svg>
    )
})

export default Printer
