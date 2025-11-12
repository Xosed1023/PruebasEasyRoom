import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const CalendarPlusFilled = (props: IconProps) => {
    return (
        <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_5130_1005)" {...props}>
                <path
                    d="M29.2727 8.88636H35.5455C35.9614 8.88636 36.3602 9.05158 36.6543 9.34567C36.9484 9.63977 37.1136 10.0386 37.1136 10.4545V18.2955H5.75V10.4545C5.75 10.0386 5.91522 9.63977 6.20931 9.34567C6.5034 9.05158 6.90227 8.88636 7.31818 8.88636H13.5909V5.75H16.7273V8.88636H26.1364V5.75H29.2727V8.88636Z"
                    fill={props.color || "#000"}
                />
                <path
                    d="M31.8959 24.7947C33.6293 24.4026 35.4384 24.5094 37.1136 25.1028V21.4316H5.75098L5.75 35.5453C5.75 35.9612 5.91522 36.3601 6.20931 36.6542C6.5034 36.9483 6.90227 37.1135 7.31818 37.1135H25.1029C24.5095 35.4382 24.4027 33.6292 24.7949 31.8957C25.1871 30.1623 26.0621 28.5754 27.3188 27.3187C28.5755 26.062 30.1625 25.1869 31.8959 24.7947Z"
                    fill={props.color || "#000"}
                />
                <path
                    d="M40.25 32.4089H35.5455V27.7044H32.4091V32.4089H27.7046V35.5453H32.4091V40.2498H35.5455V35.5453H40.25V32.4089Z"
                    fill={props.color || "#000"}
                />
            </g>
            <defs>
                <clipPath id="clip0_5130_1005">
                    <rect width="46" height="46" fill={props.color || "#000"} />
                </clipPath>
            </defs>
        </svg>
    )
}

export default CalendarPlusFilled
