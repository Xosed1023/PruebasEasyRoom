import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Chat = (props: IconProps) => {
    return (
        <svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M1.16666 5.2465C1.16636 4.78695 1.2567 4.33186 1.43253 3.90728C1.60835 3.48269 1.86621 3.09696 2.19132 2.77218C2.51643 2.44739 2.90242 2.18992 3.32717 2.01452C3.75193 1.83912 4.20712 1.74923 4.66666 1.75H9.33333C11.2659 1.75 12.8333 3.32208 12.8333 5.2465V12.25H4.66666C2.73408 12.25 1.16666 10.6779 1.16666 8.7535V5.2465ZM8.16666 6.41667V7.58333H9.33333V6.41667H8.16666ZM4.66666 6.41667V7.58333H5.83333V6.41667H4.66666Z"
                fill="white"
            />
        </svg>
    )
}

export default Chat
