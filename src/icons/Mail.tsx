import { memo } from "react"
import { IconProps } from "./Icon.type"

const Email = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...rest}>
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.667}
                d="m1.668 5.834 6.804 4.763c.551.386.827.578 1.126.653.265.066.542.066.806 0 .3-.075.576-.268 1.127-.653l6.804-4.763M5.668 16.667h8.667c1.4 0 2.1 0 2.635-.272a2.5 2.5 0 0 0 1.092-1.093c.273-.534.273-1.235.273-2.635V7.334c0-1.4 0-2.1-.273-2.635a2.5 2.5 0 0 0-1.092-1.093c-.535-.272-1.235-.272-2.635-.272H5.668c-1.4 0-2.1 0-2.635.272A2.5 2.5 0 0 0 1.94 4.7c-.272.535-.272 1.235-.272 2.635v5.333c0 1.4 0 2.1.272 2.635a2.5 2.5 0 0 0 1.093 1.093c.535.272 1.235.272 2.635.272Z"
            />
        </svg>
    )
})

export default Email
