import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const LockCheck = memo((props: IconProps) => {
    const { color = "#6941C6", secondarycolor = "#606060", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 96 96" fill="none" {...rest}>
            <g clipPath="url(#a)">
                <path
                    fill={color}
                    fillRule="evenodd"
                    d="M80 32H16a4 4 0 0 0-4 4v48a4 4 0 0 0 4 4h64a4 4 0 0 0 4-4V36a4 4 0 0 0-4-4ZM44 72v-9.072a8 8 0 1 1 8 0V72h-8Z"
                    clipRule="evenodd"
                />
                <path fill={secondarycolor} d="M24 28v4h8v-4a16 16 0 1 1 32 0v4h8v-4a24 24 0 0 0-48 0Z" />
                <g clipPath="url(#b)">
                    <path
                        fill="#408232"
                        d="m75.955 86.7 10.958-10.96-2.191-2.192-8.767 8.769-4.385-4.385-2.192 2.191 6.577 6.577Z"
                    />
                    <path
                        fill="#DBF6D4"
                        fillRule="evenodd"
                        d="M77.5 96C68.94 96 62 89.06 62 80.5 62 71.94 68.94 65 77.5 65 86.06 65 93 71.94 93 80.5 93 89.06 86.06 96 77.5 96Zm9.413-20.26L75.955 86.7l-6.577-6.577 2.192-2.191 4.385 4.385 8.767-8.769 2.191 2.192Z"
                        clipRule="evenodd"
                    />
                </g>
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M0 0h96v96H0z" />
                </clipPath>
                <clipPath id="b">
                    <path fill="#fff" d="M62 62h34v34H62z" />
                </clipPath>
            </defs>
        </svg>
    )
})

export default LockCheck
