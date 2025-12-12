import { IconProps } from "./interfaces/IconProps.interface"

const lockUnLocked04 = (props: IconProps) => (
    <svg width="1em" height="1em" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M3 8V6C3 3.23858 5.23858 1 8 1C9.63582 1 11.0882 1.78555 12.0004 3M8 12V14M15 13C15 16.866 11.866 20 8 20C4.13401 20 1 16.866 1 13C1 9.13401 4.13401 6 8 6C11.866 6 15 9.13401 15 13Z"
            stroke={props.color || "#000"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

export default lockUnLocked04
