import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const ExclamationFilled = (props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest} color="red">
            <path
                d="M9 17.1255C4.85775 17.1255 1.5 13.7677 1.5 9.62549C1.5 5.48324 4.85775 2.12549 9 2.12549C13.1423 2.12549 16.5 5.48324 16.5 9.62549C16.5 13.7677 13.1423 17.1255 9 17.1255ZM8.25 8.87549V13.3755H9.75V8.87549H8.25ZM8.25 5.87549V7.37549H9.75V5.87549H8.25Z"
                fill={color}
            />
        </svg>
    )
}

export default ExclamationFilled
