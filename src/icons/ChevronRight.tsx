import { IconProps } from "./Icon.type"

const ChevronRight = ({ color = "#000", ...props }: IconProps) => {
    return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M8.25 16.5L13.75 11L8.25 5.5"
                stroke={color}
                strokeWidth="1.69231"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default ChevronRight
