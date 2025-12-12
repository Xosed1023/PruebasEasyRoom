import React from 'react'
import { IconProps } from './interfaces/IconProps.interface'

const MoonFill = (props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
            <g clipPath="url(#clip0_83_25090)">
                <path d="M7.58927 1.3457C7.09803 1.80345 6.70401 2.35545 6.43073 2.96878C6.15745 3.58211 6.01051 4.2442 5.99866 4.91555C5.98682 5.58691 6.11031 6.25377 6.36179 6.87635C6.61326 7.49894 6.98756 8.0645 7.46235 8.53929C7.93714 9.01408 8.5027 9.38838 9.12529 9.63985C9.74787 9.89133 10.4147 10.0148 11.0861 10.003C11.7574 9.99114 12.4195 9.84419 13.0329 9.57091C13.6462 9.29763 14.1982 8.90362 14.6559 8.41237C14.4439 11.9024 11.5466 14.6664 8.00327 14.6664C4.3206 14.6664 1.33594 11.6817 1.33594 7.9997C1.33594 4.45637 4.09994 1.55904 7.58927 1.3457Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_83_25090">
                    <rect width="16" height="16" fill={color} transform="translate(0 -0.000488281)" />
                </clipPath>
            </defs>
        </svg>

    )
}

export default MoonFill