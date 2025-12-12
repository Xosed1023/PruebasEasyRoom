import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const CloseWhite = memo((props: IconProps) => {
    const { color = "var(--white)", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 14 14" fill="none" {...rest}>
            <path
                fill={color}
                d="m7 5.586 4.95-4.95 1.415 1.414L8.415 7l4.95 4.95-1.414 1.414L7 8.414l-4.95 4.95L.637 11.95 5.587 7 .637 2.05 2.05.636 7 5.586Z"
            />
        </svg>
    )
})

export default CloseWhite
