import { memo } from "react"
import { IconProps } from "./Icon.type"

const Coin = memo((props: IconProps) => {
    const { color = "#fff", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 19" fill="none" {...rest}>
            <path
                fill={color}
                d="M9.67 18.208A8.708 8.708 0 0 1 .96 9.499 8.708 8.708 0 0 1 9.67.791a8.708 8.708 0 0 1 8.708 8.708 8.708 8.708 0 0 1-8.709 8.709ZM6.62 11.24v1.742h2.177v1.741h1.742v-1.741h.87a2.177 2.177 0 0 0 0-4.354H7.929a.435.435 0 0 1 0-.871h4.79V6.016H10.54V4.274H8.798v1.742h-.87a2.177 2.177 0 0 0 0 4.354h3.483a.436.436 0 1 1 0 .871H6.62Z"
            />
        </svg>
    )
})

export default Coin
