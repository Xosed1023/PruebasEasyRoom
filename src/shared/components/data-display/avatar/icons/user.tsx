import * as React from "react"
import { IconProps } from "src/shared/icons/interfaces/IconProps.interface"

function User(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M17 19c0-1.396 0-2.093-.172-2.661a4 4 0 00-2.667-2.667c-.568-.172-1.265-.172-2.661-.172h-5c-1.396 0-2.093 0-2.661.172a4 4 0 00-2.667 2.667C1 16.907 1 17.604 1 19M13.5 5.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                stroke={props.color || "#000"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default User
