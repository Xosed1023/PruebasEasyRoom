import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Chat = (props: IconProps) => {
    return (
        <svg width={76} height={74} viewBox="0 0 76 74" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M30.5 0.25H45.5C53.4565 0.25 61.0871 3.41071 66.7132 9.0368C72.3393 14.6629 75.5 22.2935 75.5 30.25C75.5 38.2065 72.3393 45.8371 66.7132 51.4632C61.0871 57.0893 53.4565 60.25 45.5 60.25V73.375C26.75 65.875 0.5 54.625 0.5 30.25C0.5 22.2935 3.66071 14.6629 9.2868 9.0368C14.9129 3.41071 22.5435 0.25 30.5 0.25V0.25Z"
                fill="white"
            />
        </svg>
    )
}

export default Chat
