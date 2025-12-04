import { memo } from "react"
import { IconProps } from "./Icon.type"

const Home = memo((props: IconProps) => {
    const { color = "#BEBEBE", secondarycolor = "transparent", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 25" fill="none" {...rest}>
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                fill={secondarycolor}
                d="m9.02 2.885-5.39 4.2c-.9.7-1.63 2.19-1.63 3.32v7.41c0 2.32 1.89 4.22 4.21 4.22h11.58c2.32 0 4.21-1.9 4.21-4.21v-7.28c0-1.21-.81-2.76-1.8-3.45l-6.18-4.33c-1.4-.98-3.65-.93-5 .12ZM12 18.035v-3"
            />
        </svg>
    )
})

export default Home
