import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function arrowRigth(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M1.833 19.167L11 10 1.833.833 0 2.666 7.334 10 0 17.334l1.833 1.833z"
                fill={props.color || "#000"}
            />
        </svg>
    )
}

export default arrowRigth
 