import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const InfoCircle = memo((props: IconProps) => {
    const { color = "var(--white)", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 17 17" fill="none" {...rest}>
            <path
                fill={color}
                d="M8.413 15.323c-3.682 0-6.667-2.962-6.667-6.617s2.985-6.618 6.667-6.618 6.666 2.963 6.666 6.618c0 3.655-2.984 6.617-6.666 6.617Zm-.667-7.279v3.97H9.08v-3.97H7.746Zm0-2.647v1.324H9.08V5.397H7.746Z"
            />
        </svg>
    )
})

export default InfoCircle
