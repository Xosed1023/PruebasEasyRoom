import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"
const Pointer = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={7} height={4} fill={props.color || "#000"} {...props}>
        <path fill="#000" d="M3.5 3.767 6.531.192H.47L3.5 3.767Z" />
        <path fill="#000" d="M3.5 3.767 6.531.192H.47L3.5 3.767Z" />
        <path fill="#000" d="M3.5 3.767 6.531.192H.47L3.5 3.767Z" />
        <path fill="#000" d="M3.5 3.767 6.531.192H.47L3.5 3.767Z" />
    </svg>
)
export default Pointer
