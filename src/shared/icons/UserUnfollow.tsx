import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const UserUnfollow = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 32 32" fill="none" {...rest}>
            <path
                d="M18.665 19.003v10.331H5.332a10.667 10.667 0 0 1 13.333-10.33ZM16 17.334c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8Zm9.333 4.781 2.828-2.829 1.887 1.887L27.217 24l2.83 2.828-1.887 1.886-2.828-2.829-2.828 2.83-1.887-1.887L23.447 24l-2.83-2.828 1.887-1.887 2.828 2.83Z"
                fill={color}
            />
        </svg>
    )
})

export default UserUnfollow
