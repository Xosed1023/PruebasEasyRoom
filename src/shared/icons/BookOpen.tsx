import React from 'react'
import { IconProps } from './interfaces/IconProps.interface'

const BookOpen = (props: IconProps) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_197_28150)">
                <path d="M14.0026 14H8.66927V4C8.66927 3.46957 8.87998 2.96086 9.25506 2.58579C9.63013 2.21071 10.1388 2 10.6693 2H14.0026C14.1794 2 14.349 2.07024 14.474 2.19526C14.599 2.32029 14.6693 2.48986 14.6693 2.66667V13.3333C14.6693 13.5101 14.599 13.6797 14.474 13.8047C14.349 13.9298 14.1794 14 14.0026 14ZM7.33594 14H2.0026C1.82579 14 1.65622 13.9298 1.5312 13.8047C1.40618 13.6797 1.33594 13.5101 1.33594 13.3333V2.66667C1.33594 2.48986 1.40618 2.32029 1.5312 2.19526C1.65622 2.07024 1.82579 2 2.0026 2H5.33594C5.86637 2 6.37508 2.21071 6.75015 2.58579C7.12522 2.96086 7.33594 3.46957 7.33594 4V14ZM7.33594 14H8.66927V15.3333H7.33594V14Z" fill={props.color || "#000"} />
            </g>
            <defs>
                <clipPath id="clip0_197_28150">
                    <rect width="16" height="16" fill={props.color || "#000"} />
                </clipPath>
            </defs>
        </svg>

    )
}

export default BookOpen