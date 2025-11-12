import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function docs(props: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} fill="none" {...props}>
            <g >
                <path
                    fill="#6941C6"
                    d="M17.5 15V7.5A2.5 2.5 0 0 1 20 5h30a2.5 2.5 0 0 1 2.5 2.5v35A2.5 2.5 0 0 1 50 45h-7.5v7.5c0 1.38-1.125 2.5-2.517 2.5H10.018A2.502 2.502 0 0 1 7.5 52.5l.008-35c0-1.38 1.125-2.5 2.517-2.5H17.5Zm5 0h20v25h5V10h-25v5Zm-5 12.5v5h15v-5h-15Zm0 10v5h15v-5h-15Z"
                />
            </g>
        </svg>
    )
}

export default docs
