import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Drink = ({ color, ...props }: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
            <path
                fill={color || "#000"}
                fillRule="evenodd"
                d="M14 2.966a.966.966 0 0 1-.244.642L8.919 9.049a1 1 0 0 0-.252.665v1.953a1 1 0 0 0 1 1h1.666a.667.667 0 1 1 0 1.333H4.667a.667.667 0 0 1 0-1.333h1.666a1 1 0 0 0 1-1V9.714a1 1 0 0 0-.252-.665L2.383 3.764A1.515 1.515 0 0 1 2 2.757C2 2.34 2.34 2 2.757 2h10.277c.534 0 .966.433.966.966Zm-10.227.367 1.18 1.334h6.094l1.186-1.334h-8.46Z"
                clipRule="evenodd"
            />
        </svg>
    )
}

export default Drink
