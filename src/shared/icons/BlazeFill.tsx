import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const BlazeFill = ({ color = "#000", ...props }: IconProps) => {
    return (
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_9861_234)">
                <path
                    d="M12.3257 6.62533C12.9924 7.33199 13.3257 8.22133 13.3257 9.29199C13.3257 11.6027 10.859 12.1427 9.65902 15.292C9.21435 14.9087 8.99235 14.3533 8.99235 13.6253C8.99235 11.304 12.3257 10.0987 12.3257 6.62533ZM9.65902 3.95866C10.459 4.78399 10.859 5.67333 10.859 6.62533C10.859 9.92599 6.82902 10.42 7.65902 15.292C6.54768 14.5187 5.99235 13.4073 5.99235 11.9587C5.99235 9.74199 9.65902 7.95866 9.65902 3.95866ZM6.65902 1.29199C7.54768 2.40333 7.99235 3.40333 7.99235 4.29199C7.99235 8.45866 2.32568 9.77333 5.32568 15.292C3.58168 14.9053 2.32568 13.292 2.32568 11.292C2.32568 6.95866 6.65902 6.29199 6.65902 1.29199Z"
                    fill={color}
                />
            </g>
            <defs>
                <clipPath id="clip0_9861_234">
                    <rect width="16" height="16" fill="white" transform="translate(-0.0078125 0.625244)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default BlazeFill
