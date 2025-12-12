import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function building4Fill(props: IconProps) {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_75_10254)">
                <path
                    d="M13.9974 13.332H15.3307V14.6654H0.664062V13.332H1.9974V1.9987C1.9974 1.82189 2.06763 1.65232 2.19266 1.52729C2.31768 1.40227 2.48725 1.33203 2.66406 1.33203H13.3307C13.5075 1.33203 13.6771 1.40227 13.8021 1.52729C13.9272 1.65232 13.9974 1.82189 13.9974 1.9987V13.332ZM5.33073 7.33203V8.66536H7.33073V7.33203H5.33073ZM5.33073 4.66536V5.9987H7.33073V4.66536H5.33073ZM5.33073 9.9987V11.332H7.33073V9.9987H5.33073ZM8.66406 9.9987V11.332H10.6641V9.9987H8.66406ZM8.66406 7.33203V8.66536H10.6641V7.33203H8.66406ZM8.66406 4.66536V5.9987H10.6641V4.66536H8.66406Z"
                    fill={props.color ?? "#fff"}
                />
            </g>
            <defs>
                <clipPath id="clip0_75_10254">
                    <rect width="16" height="16" fill={props.color ?? "#fff"} />
                </clipPath>
            </defs>
        </svg>
    )
}

export default building4Fill
