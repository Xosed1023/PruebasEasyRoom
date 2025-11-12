import React from "react"
import { IconNamesProps } from "./Icon"

const PieChartFilled = (props: IconNamesProps) => {
    return (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_19431_1088)">
                <path
                    d="M11 2.54997V13.5H21.95C21.449 18.553 17.185 22.5 12 22.5C6.477 22.5 2 18.023 2 12.5C2 7.31497 5.947 3.05097 11 2.54997ZM13 1.04297C18.553 1.51997 22.979 5.94697 23.457 11.5H13V1.04297Z"
                    fill={props.color || "#fff"}
                />
            </g>
            <defs>
                <clipPath id="clip0_19431_1088">
                    <rect width="24" height="24" fill={props.color || "#fff"} transform="translate(0 0.5)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default PieChartFilled
