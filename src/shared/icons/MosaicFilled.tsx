import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const MosaicFilled = (props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props

    return (
        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_14258_12156)" {...rest}>
                <path
                    d="M7.95152 8.77133L8.87219 14H3.15885C2.79085 14 2.49219 13.7013 2.49219 13.3333V9.73467L7.95152 8.77133ZM13.8255 2C14.1935 2 14.4922 2.29867 14.4922 2.66667V13.3333C14.4922 13.7013 14.1935 14 13.8255 14H10.2269L8.11086 2H13.8255ZM6.75686 2L7.71952 7.45867L2.49219 8.38V2.66667C2.49219 2.29867 2.79085 2 3.15885 2H6.75686Z"
                    fill={color}
                />
            </g>
            <defs>
                <clipPath id="clip0_14258_12156">
                    <rect width="16" height="16" fill="white" transform="translate(0.492188)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default MosaicFilled
