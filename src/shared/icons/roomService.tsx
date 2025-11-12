import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"
const RoomServiceCommand = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill="none" {...props}>
        <path
            fill={props.color || "#000"}
            d="M25.632 21v1.166c0 1.925 0 3.5-3.5 3.5H5.798c-3.5 0-3.5-1.575-3.5-3.5V21a1.17 1.17 0 0 1 1.167-1.167h21A1.17 1.17 0 0 1 25.632 21ZM16.812 6.043c.058-.233.093-.455.105-.7.035-1.353-.794-2.543-2.1-2.893a2.923 2.923 0 0 0-3.629 3.593c-4.211.898-7.373 4.643-7.373 9.123v1.75a1.17 1.17 0 0 0 1.167 1.167h18.025a1.17 1.17 0 0 0 1.166-1.167v-1.75c0-4.48-3.15-8.213-7.361-9.123Zm.688 7.665h-7a.881.881 0 0 1-.875-.875c0-.478.397-.875.875-.875h7c.478 0 .875.397.875.875a.881.881 0 0 1-.875.875Z"
        />
    </svg>
)
export default RoomServiceCommand
