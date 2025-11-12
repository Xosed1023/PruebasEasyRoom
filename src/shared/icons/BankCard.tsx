import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const BankCard = ({ color = "#000", style = {}, ...rest }: IconProps) => {
    return (
        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
            <g clipPath="url(#clip0_7880_52339)" {...rest}>
                <path
                    d="M15.1693 7.33333V13.3333C15.1693 13.5101 15.099 13.6797 14.974 13.8047C14.849 13.9298 14.6794 14 14.5026 14H2.5026C2.32579 14 2.15622 13.9298 2.0312 13.8047C1.90618 13.6797 1.83594 13.5101 1.83594 13.3333V7.33333H15.1693ZM15.1693 4.66667H1.83594V2.66667C1.83594 2.48986 1.90618 2.32029 2.0312 2.19526C2.15622 2.07024 2.32579 2 2.5026 2H14.5026C14.6794 2 14.849 2.07024 14.974 2.19526C15.099 2.32029 15.1693 2.48986 15.1693 2.66667V4.66667Z"
                    fill={color}
                />
            </g>
            <defs>
                <clipPath id="clip0_7880_52339">
                    <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default BankCard
