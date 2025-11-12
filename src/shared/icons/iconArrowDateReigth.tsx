import { IconProps } from "./interfaces/IconProps.interface"

export const IconArrowDateR = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" {...props}>
        <path
            stroke={props.color || "#000"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.667}
            d="m1.5 11 5-5-5-5"
        />
    </svg>
)

export default IconArrowDateR
