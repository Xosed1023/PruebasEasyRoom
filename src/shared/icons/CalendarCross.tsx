import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"
const CalendarCross = ({ color, size = "ch", ...props }: IconProps) => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g clipPath="url(#clip0_1436_74777)">
            <path
                d="M19.8335 3.50033H24.5002C24.8096 3.50033 25.1063 3.62324 25.3251 3.84203C25.5439 4.06083 25.6668 4.35757 25.6668 4.66699V23.3337C25.6668 23.6431 25.5439 23.9398 25.3251 24.1586C25.1063 24.3774 24.8096 24.5003 24.5002 24.5003H3.50016C3.19074 24.5003 2.894 24.3774 2.6752 24.1586C2.45641 23.9398 2.3335 23.6431 2.3335 23.3337V4.66699C2.3335 4.35757 2.45641 4.06083 2.6752 3.84203C2.894 3.62324 3.19074 3.50033 3.50016 3.50033H8.16683V1.16699H10.5002V3.50033H17.5002V1.16699H19.8335V3.50033ZM4.66683 10.5003V22.167H23.3335V10.5003H4.66683Z"
                fill={color || "#000"}
            />
            <g clipPath="url(#clip1_1436_74777)">
                <path
                    d="M13.9999 16.8115L16.4061 14.4053L17.0935 15.0926L14.6872 17.4989L17.0935 19.9051L16.4061 20.5925L13.9999 18.1862L11.5936 20.5925L10.9062 19.9051L13.3125 17.4989L10.9062 15.0926L11.5936 14.4053L13.9999 16.8115Z"
                    fill={color || "#000"}
                />
            </g>
        </g>
        <defs>
            <clipPath id="clip0_1436_74777">
                <rect width="28" height="28" fill="white" />
            </clipPath>
            <clipPath id="clip1_1436_74777">
                <rect width="11.6667" height="11.6667" fill="white" transform="translate(8.1665 11.667)" />
            </clipPath>
        </defs>
    </svg>
)
export default CalendarCross
