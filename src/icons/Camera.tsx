import { memo } from "react"
import { IconProps } from "./Icon.type"

const Camera = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.58}
                d="M1.336 5.134c0-.995.806-1.801 1.801-1.801a1.2 1.2 0 0 0 1.14-.821l.059-.179c.028-.084.042-.127.057-.164a1.333 1.333 0 0 1 1.157-.834c.04-.002.084-.002.173-.002h4.559c.089 0 .133 0 .174.002.514.032.964.356 1.156.834.015.037.03.08.057.164l.06.179a1.2 1.2 0 0 0 1.14.821c.994 0 1.8.806 1.8 1.801V10.8c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C13.15 14 12.59 14 11.47 14H4.536c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874c-.218-.428-.218-.988-.218-2.108V5.134Z"
            />
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.58}
                d="M8.003 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            />
        </svg>
    )
})

export default Camera
