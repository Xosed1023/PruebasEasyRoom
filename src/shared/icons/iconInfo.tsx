import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function icoInfo(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#prefix__clip0_6_3)" fill={props.color || "#000"}>
                <path d="M11 10a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1zM11 6a1 1 0 100 2h.01a1 1 0 100-2H11z" />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 11C0 4.925 4.925 0 11 0s11 4.925 11 11-4.925 11-11 11S0 17.075 0 11zm11-9a9 9 0 100 18 9 9 0 000-18z"
                />
            </g>
            <defs>
                <clipPath id="prefix__clip0_6_3">
                    <path fill={props.color || "#000"} d="M0 0h22v22H0z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default icoInfo
