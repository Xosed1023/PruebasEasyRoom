import { IconNamesProps } from "./Icon"

const chevronRight = (props: IconNamesProps) => (
    <svg width="1em" height="1em" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M1 13L7 7L1 1"
            stroke={props.color || "#000"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export default chevronRight
