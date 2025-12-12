import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function phonealertfill(props:IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#prefix__clip0_67_14)">
                <path
                    d="M14 10.947v2.357a.667.667 0 01-.62.665c-.291.02-.53.031-.713.031C6.775 14 2 9.225 2 3.333c0-.184.01-.422.03-.713A.667.667 0 012.697 2h2.357a.333.333 0 01.332.3 9.267 9.267 0 00.848 3.035.304.304 0 01-.098.378L4.697 6.741a8.698 8.698 0 004.562 4.563l1.027-1.436a.308.308 0 01.382-.1 9.268 9.268 0 003.033.847.333.333 0 01.3.332H14z"
                    fill={props.color || ""}
                />
                <g clipPath="url(#prefix__clip1_67_14)">
                    <path
                        d="M12.11 2.291l3.043 5.271a.319.319 0 01-.277.48H8.79a.32.32 0 01-.276-.48l3.043-5.27a.32.32 0 01.553 0zm-.596 4.153v.639h.639v-.639h-.639zm0-2.236v1.597h.639V4.208h-.639z"
                        fill={props.color || ""}
                    />
                </g>
            </g>
            <defs>
                <clipPath id="prefix__clip0_67_14">
                    <path fill={props.color || ""} d="M0 0h16v16H0z" />
                </clipPath>
                <clipPath id="prefix__clip1_67_14">
                    <path fill={props.color || ""} transform="translate(8 1.333)" d="M0 0h7.667v7.667H0z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default phonealertfill
