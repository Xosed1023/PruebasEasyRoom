import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function editFill(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 67 66" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M25.916 52.245l-6.166 5.5h-11V46.077l27.225-27.225 11.666 11.67-21.725 21.723zm13.945-37.28l5.835-5.835a2.75 2.75 0 013.889 0l7.78 7.78a2.75 2.75 0 010 3.889l-5.836 5.832-11.666-11.665h-.002z"
                fill={props.color || "#fff"}
            />
        </svg>
    )
}

export default editFill
