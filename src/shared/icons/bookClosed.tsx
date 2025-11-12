import * as React from "react"
import { IconNamesProps } from "./Icon"

const bookClosed = (props: IconNamesProps) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M20 19v-3H7a3 3 0 00-3 3m4.8 3h8c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C20 20.48 20 19.92 20 18.8V5.2c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C18.48 2 17.92 2 16.8 2h-8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C4 4.28 4 5.12 4 6.8v10.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C6.28 22 7.12 22 8.8 22z"
                stroke={props.color ? props.color : "#000"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default bookClosed
