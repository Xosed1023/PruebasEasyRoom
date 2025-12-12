import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function store3Fill(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#prefix__clip0_43_7)">
                <path
                    d="M70 43.333v23.334A3.333 3.333 0 0166.667 70H13.333A3.333 3.333 0 0110 66.667V43.333H6.667v-6.666L10 20h60l3.333 16.667v6.666H70zm-53.333 0v20h46.666v-20H16.667zM20 46.667h26.667v10H20v-10zM10 10h60v6.667H10V10z"
                    fill={props.color || "#fff"}
                />
            </g>
            <defs>
                <clipPath id="prefix__clip0_43_7">
                    <path fill={props.color || "#fff"} d="M0 0h80v80H0z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default store3Fill
