import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const DocumentExcelFilled = ({ color = "#000", ...props }: IconProps) => {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_292_18302)" {...props}>
                <path
                    d="M9.33333 1.1665L12.25 4.08317V12.2545C12.2498 12.408 12.1887 12.5552 12.0801 12.6637C11.9715 12.7722 11.8243 12.8332 11.6707 12.8332H2.32925C2.17605 12.8321 2.02943 12.7708 1.92104 12.6625C1.81266 12.5543 1.75122 12.4077 1.75 12.2545V1.74517C1.75 1.4255 2.00958 1.1665 2.32925 1.1665H9.33333ZM7.7 6.99984L9.33333 4.6665H7.93333L7 6L6.06667 4.6665H4.66667L6.3 6.99984L4.66667 9.33317H6.06667L7 7.99967L7.93333 9.33317H9.33333L7.7 6.99984Z"
                    fill={color}
                />
            </g>
            <defs>
                <clipPath id="clip0_292_18302">
                    <rect width="14" height="14" fill={color} />
                </clipPath>
            </defs>
        </svg>
    )
}

export default DocumentExcelFilled
