import * as React from "react"
import { SVGProps } from "react"
const waterFlashFill = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" {...props}>
        <path
            fill="#faf9f9ff"
            d="M4.227 4.977 9 .204l4.773 4.773a6.75 6.75 0 1 1-9.546 0ZM9.75 8.25V4.875L6.375 9.75H8.25v3.375l3.375-4.875H9.75Z"
        />
    </svg>
)

export default waterFlashFill
