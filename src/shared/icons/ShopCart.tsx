import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const ShopCart = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 86 86" fill="none" {...rest}>
            <path
                d="M14.337 22.983 2.716 11.366l5.07-5.07 11.617 11.62h54.618a3.583 3.583 0 0 1 3.432 4.612l-8.6 28.667a3.583 3.583 0 0 1-3.432 2.555H21.503v7.167H60.92v7.166h-43a3.583 3.583 0 0 1-3.583-3.583V22.983Zm5.375 59.434a5.375 5.375 0 1 1 0-10.75 5.375 5.375 0 0 1 0 10.75Zm43 0a5.375 5.375 0 1 1 0-10.75 5.375 5.375 0 0 1 0 10.75Z"
                fill={color}
            />
        </svg>
    )
})

export default ShopCart
