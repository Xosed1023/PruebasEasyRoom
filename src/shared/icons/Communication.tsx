import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"
const Communication = ({ color, ...props }: IconProps) => (
    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g clipPath="url(#clip0_251_29545)">
            <path d="M4.92987 1.54297H6.52078C7.36466 1.54297 8.17396 1.83756 8.77067 2.36194C9.36738 2.88632 9.70261 3.59753 9.70261 4.33911C9.70261 5.08069 9.36738 5.7919 8.77067 6.31628C8.17396 6.84065 7.36466 7.13525 6.52078 7.13525V8.35856C4.53214 7.65952 1.74805 6.61097 1.74805 4.33911C1.74805 3.59753 2.08327 2.88632 2.67998 2.36194C3.27669 1.83756 4.086 1.54297 4.92987 1.54297Z" fill={color || "#000"} />
        </g>
        <defs>
            <clipPath id="clip0_251_29545">
                <rect width="9.54547" height="8.38842" fill={color || "#000"} transform="translate(0.953125 0.492188)" />
            </clipPath>
        </defs>
    </svg>

)
export default Communication
