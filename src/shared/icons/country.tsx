import * as React from "react"
import { IconNamesProps } from "./Icon"

const country = (props: IconNamesProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={17} height={16} fill="none" {...props}>
        <path
            fill="#0E0E0E"
            d="m1.833 3.334 4.667-2 4 2 4.202-1.8a.333.333 0 0 1 .465.306v10.827l-4.667 2-4-2-4.202 1.801a.334.334 0 0 1-.465-.307V3.334Zm2.667 4v1.333h1.333V7.334H4.5Zm2.667 0v1.333H8.5V7.334H7.167Zm4-.04-.825-.825-.707.706.824.826-.824.824.706.708.826-.825.824.825.708-.707-.825-.825.825-.825-.707-.707-.825.824v.001Z"
        />
    </svg>
)

export default country
