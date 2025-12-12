import { IconNamesProps } from "./Icon"

const minus = (props: IconNamesProps) => (
    <svg width="1em" height="1em" viewBox="0 0 16 2" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M1 1H15" stroke={props.color || "#000"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export default minus
