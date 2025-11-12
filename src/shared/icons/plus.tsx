import * as React from "react"
import { IconNamesProps } from "./Icon"

function plus(props: IconNamesProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M7.83333 7.83333V0.833334H10.1667V7.83333H17.1667V10.1667H10.1667V17.1667H7.83333V10.1667H0.833334V7.83333H7.83333Z"
                fill={props.color || "#fff"}
            />
        </svg>
    )
}

export default plus
