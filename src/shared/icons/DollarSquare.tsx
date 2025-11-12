import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const DollarSquare = memo((props: IconProps) => {
    const { color = "#6941C6", ...rest } = props
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="0 0 60 60" fill="none" {...rest}>
            <path
                fill={color}
                d="M7.5 7.5h45A2.5 2.5 0 0 1 55 10v40a2.5 2.5 0 0 1-2.5 2.5h-45A2.5 2.5 0 0 1 5 50V10a2.5 2.5 0 0 1 2.5-2.5ZM21.25 35v5h6.25v5h5v-5H35a6.25 6.25 0 0 0 0-12.5H25a1.25 1.25 0 0 1 0-2.5h13.75v-5H32.5v-5h-5v5H25a6.25 6.25 0 0 0 0 12.5h10a1.25 1.25 0 0 1 0 2.5H21.25Z"
            />
        </svg>
    )
})

export default DollarSquare
