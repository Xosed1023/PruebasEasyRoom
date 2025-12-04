import { memo } from "react"
import { IconProps } from "./Icon.type"

const Pencil = memo((props: IconProps) => {
    const { color = "#000", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" {...rest}>
            <g clipPath="url(#a)">
                <path
                    stroke={color}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5 7 3m-5.75 7.75 1.692-.188a2.11 2.11 0 0 0 .407-.066c.086-.027.167-.067.242-.116.085-.056.159-.13.306-.277L10.5 3.5a1.414 1.414 0 1 0-2-2L1.897 8.103c-.147.147-.22.22-.277.306a1 1 0 0 0-.116.242c-.032.097-.043.2-.066.407L1.25 10.75Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill={color} d="M0 0h12v12H0z" />
                </clipPath>
            </defs>
        </svg>
    )
})

export default Pencil
