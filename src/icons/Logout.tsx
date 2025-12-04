import { memo } from "react"
import { IconProps } from "./Icon.type"

const Logout = memo((props: IconProps) => {
    const { color = "#000", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.583}
                d="M10.667 11.333 14 8m0 0-3.333-3.333M14 8H6m2 3.333c0 .197 0 .296-.007.381a2 2 0 0 1-1.603 1.79c-.084.017-.182.028-.378.05l-.68.076c-1.024.113-1.535.17-1.942.04a2 2 0 0 1-1.216-1.088C2 12.191 2 11.677 2 10.648V5.352c0-1.03 0-1.544.174-1.934A2 2 0 0 1 3.39 2.33c.407-.13.918-.074 1.941.04l.681.076c.196.021.294.032.378.049a2 2 0 0 1 1.603 1.79C8 4.372 8 4.47 8 4.668"
            />
        </svg>
    )
})

export default Logout
