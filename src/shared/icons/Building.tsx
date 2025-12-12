import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Building = memo((props: IconProps) => {
    const { color = "#000", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 22 20" fill="none" {...rest}>
            <path
                d="M6.5 5h2.75M6.5 9h2.75M6.5 13h2.75m3.5-8h2.75m-2.75 4h2.75m-2.75 4h2.75m3.5 6V4.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C17.48 1 16.92 1 15.8 1H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C3 2.52 3 3.08 3 4.2V19m18 0H1"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
})

export default Building
