import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const billFill = memo((props: IconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 22 22"
            fill="none"
            {...props}
        >
            <g>
                <path
                    fill="#0E0E0E"
                    d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1ZM8 9v2h8V9H8Zm0 4v2h8v-2H8Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M0 0h24v24H0z" />
                </clipPath>
            </defs>
        </svg>
    )
})

export default billFill
