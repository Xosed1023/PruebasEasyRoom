import * as React from "react"
import { IconNamesProps } from "./Icon"

const cubeCash = (props: IconNamesProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" {...props}>
        <path
            fill={props.color || "#000"}
            d="M12.75 12h1.5V3h-7.5v1.5h6V12Zm0 1.5v2.25c0 .414-.338.75-.755.75h-8.99a.751.751 0 0 1-.755-.75l.002-10.5c0-.414.338-.75.756-.75H5.25V2.25A.75.75 0 0 1 6 1.5h9a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-2.25ZM3.752 6l-.002 9h7.5V6H3.752Zm1.498 6h3.375a.375.375 0 1 0 0-.75h-2.25a1.875 1.875 0 1 1 0-3.75h.375v-.75h1.5v.75h1.5V9H6.375a.375.375 0 0 0 0 .75h2.25a1.875 1.875 0 1 1 0 3.75H8.25v.75h-1.5v-.75h-1.5V12Z"
        />
    </svg>
)

export default cubeCash
