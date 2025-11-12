import { IconNamesProps } from "./Icon"

const checkSquareBroken = (props: IconNamesProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" {...props}>
        <path
            stroke={props.color || "#000"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m7 9 3 3L20 2m-6-1H5.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C1 3.28 1 4.12 1 5.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C3.28 19 4.12 19 5.8 19h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C19 16.72 19 15.88 19 14.2V10"
        />
    </svg>
)

export default checkSquareBroken
