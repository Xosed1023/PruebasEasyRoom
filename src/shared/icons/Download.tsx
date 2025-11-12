import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Download = memo((props: IconProps) => {
    const { color = "var(--header)", ...rest } = props
    return (
        <svg width={15} height={18} viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
            <path
                d="M0 15.8333H15V17.5H0V15.8333ZM8.33333 7.5H14.1667L7.5 14.1667L0.833333 7.5H6.66667V0.833333H8.33333V7.5Z"
                fill={color}
            />
        </svg>
    )
})

export default Download
