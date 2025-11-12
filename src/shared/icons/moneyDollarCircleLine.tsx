import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function moneyDollarCircleLine(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#prefix__clip0_45_11)">
                <path
                    d="M4.838 12.87h8.275a.752.752 0 000-1.504H7.095a3.762 3.762 0 110-7.523H8.6V.833h3.009v3.01h3.761v3.009H7.095a.752.752 0 100 1.504h6.018a3.762 3.762 0 010 7.524H11.61v3.009h-3.01v-3.01H4.839V12.87z"
                    fill={props.color ?? "#fff"}
                />
            </g>
            <defs>
                <clipPath id="prefix__clip0_45_11">
                    <path fill={props.color ?? "#fff"} d="M0 0h20v20H0z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default moneyDollarCircleLine
