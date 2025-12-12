import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Users = memo((props: IconProps) => {
    const { color = "#000", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...rest}>
            <path
                d="M22 21v-2a4.002 4.002 0 00-3-3.874M15.5 3.291a4.001 4.001 0 010 7.418M17 21c0-1.864 0-2.796-.305-3.53a4 4 0 00-2.164-2.165C13.796 15 12.864 15 11 15H8c-1.864 0-2.796 0-3.53.305a4 4 0 00-2.166 2.164C2 18.204 2 19.136 2 21M13.5 7a4 4 0 11-8 0 4 4 0 018 0z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
})

export default Users
