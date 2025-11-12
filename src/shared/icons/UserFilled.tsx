import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"
const UserFilled = ({ color, ...props }: IconProps) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M4.48828 21.3876C4.48828 19.3955 5.27963 17.485 6.68823 16.0764C8.09684 14.6678 10.0073 13.8765 11.9994 13.8765C13.9915 13.8765 15.9019 14.6678 17.3105 16.0764C18.7192 17.485 19.5105 19.3955 19.5105 21.3876H4.48828ZM11.9994 12.9376C8.88698 12.9376 6.36606 10.4166 6.36606 7.30423C6.36606 4.19181 8.88698 1.6709 11.9994 1.6709C15.1118 1.6709 17.6327 4.19181 17.6327 7.30423C17.6327 10.4166 15.1118 12.9376 11.9994 12.9376Z"
            fill={color || "#000"}
        />
    </svg>
)
export default UserFilled
