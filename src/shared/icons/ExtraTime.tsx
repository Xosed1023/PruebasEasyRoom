import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const ExtraTimeIcon = (props: IconProps) => {
    const { width = "18", height = "18", ...rest } = props
    return (
        <svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
            <g clipPath="url(#clip0_8532_78370)">
                <path
                    d="M9 1.5C4.85775 1.5 1.5 4.85775 1.5 9C1.5 13.1422 4.85775 16.5 9 16.5C13.1423 16.5 16.5 13.1422 16.5 9H15C15 12.3135 12.3135 15 9 15C5.6865 15 3 12.3135 3 9C3 5.6865 5.6865 3 9 3C10.848 3 12.501 3.8355 13.6013 5.14875L12 6.75H16.5V2.25L14.6648 4.0845C13.29 2.502 11.262 1.5 9 1.5ZM8.25 5.25V8.68875L5.81775 11.121L6.879 12.1822L9.75 9.30975V5.25H8.25Z"
                    fill={props.color || "#000"}
                />
            </g>
            <defs>
                <clipPath id="clip0_8532_78370">
                    <rect width="18" height="18" fill={props.color || "#000"} transform="matrix(-1 0 0 1 18 0)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default ExtraTimeIcon
