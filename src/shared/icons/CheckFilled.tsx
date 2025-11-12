import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const CheckFilled = (props: IconProps) => (
    <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M14.8185 26.8185C8.37502 26.8185 3.15186 21.5275 3.15186 15.0003C3.15186 8.47313 8.37502 3.18213 14.8185 3.18213C21.262 3.18213 26.4852 8.47313 26.4852 15.0003C26.4852 21.5275 21.262 26.8185 14.8185 26.8185ZM13.6554 19.7276L21.9037 11.3709L20.254 9.69986L13.6554 16.3854L10.3549 13.042L8.70519 14.7131L13.6554 19.7276Z"
            fill={props.color || "#000"}
        />
    </svg>
)
export default CheckFilled
