import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const CloseCircle = ({ color, ...props }: IconProps) => {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_5357_25897)">
                <path
                    d="M7.99076 15.2943C4.30876 15.2943 1.3241 12.3096 1.3241 8.6276C1.3241 4.9456 4.30876 1.96094 7.99076 1.96094C11.6728 1.96094 14.6574 4.9456 14.6574 8.6276C14.6574 12.3096 11.6728 15.2943 7.99076 15.2943ZM7.99076 7.68494L6.10543 5.79894L5.1621 6.74227L7.0481 8.6276L5.1621 10.5129L6.10543 11.4563L7.99076 9.57027L9.8761 11.4563L10.8194 10.5129L8.93343 8.6276L10.8194 6.74227L9.8761 5.79894L7.99076 7.68494Z"
                    fill={color || "#000"}
                />
            </g>
            <defs>
                <clipPath id="clip0_5357_25897">
                    <rect width="16" height="16" fill="white" transform="translate(-0.00927734 0.625)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default CloseCircle
