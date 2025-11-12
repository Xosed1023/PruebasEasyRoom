import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const SearchWatch = (props: IconProps) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.7124 10.0629H11.4351L16 14.6369L14.6369 16L10.0629 11.4351V10.7124L9.81589 10.4563C8.77301 11.3528 7.4191 11.8925 5.94625 11.8925C2.66209 11.8925 0 9.23042 0 5.94625C0 2.66209 2.66209 0 5.94625 0C9.23042 0 11.8925 2.66209 11.8925 5.94625C11.8925 7.4191 11.3528 8.77301 10.4563 9.81589L10.7124 10.0629ZM1.82986 5.94476C1.82986 8.22264 3.66863 10.0614 5.9465 10.0614C8.22437 10.0614 10.0631 8.22264 10.0631 5.94476C10.0631 3.66689 8.22437 1.82812 5.9465 1.82812C3.66863 1.82812 1.82986 3.66689 1.82986 5.94476Z"
                fill={props.color || "#000"}
            />
            <circle cx="6.25" cy="6.25" r="5.25" fill={props.color || "#000"} />
            <path
                d="M5 3L5 6.21429L5 6.24392C5 6.44945 5.09926 6.64233 5.2665 6.76179V6.76179L7 8"
                stroke={props.secondarycolor || "#000"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default SearchWatch
