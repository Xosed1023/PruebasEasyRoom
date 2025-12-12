import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const UserAdd = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 18 19" fill="none" {...rest}>
            <path
                d="M10.5 11.189V17H3a6 6 0 017.5-5.811zM9 10.25a4.499 4.499 0 01-4.5-4.5c0-2.486 2.014-4.5 4.5-4.5s4.5 2.014 4.5 4.5-2.014 4.5-4.5 4.5zm4.5 3V11H15v2.25h2.25v1.5H15V17h-1.5v-2.25h-2.25v-1.5h2.25z"
                fill={color}
            />
        </svg>
    )
})

export default UserAdd
