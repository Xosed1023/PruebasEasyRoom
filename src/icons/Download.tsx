import { IconProps } from "./Icon.type"

const Download = ({ color = "#000", ...props }: IconProps) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M17.5 17.5H2.5M15 9.16667L10 14.1667M10 14.1667L5 9.16667M10 14.1667V2.5"
                stroke={color}
                strokeWidth="1.54167"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default Download
