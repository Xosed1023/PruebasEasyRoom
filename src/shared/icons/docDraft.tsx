import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function docDraft(props: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={120} height={120} viewBox="0 0 120 120" fill="none" {...props}>
            <circle cx={60} cy={60} r={60} fill="#EFE9FF" />
            <g>
                <path
                    fill="#6941C6"
                    d="M80 35a2.5 2.5 0 0 1 2.5 2.5v9.392l-22.498 22.5-.015 10.596 10.616.014L82.5 68.105V82.5A2.5 2.5 0 0 1 80 85H40a2.5 2.5 0 0 1-2.5-2.5v-45A2.5 2.5 0 0 1 40 35h40Zm4.445 17.02 3.535 3.535L68.535 75l-3.54-.005.005-3.53L84.445 52.02ZM60 60H47.5v5H60v-5Zm7.5-10h-20v5h20v-5Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M30 30h60v60H30z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default docDraft
