import { IconProps } from "./Icon.type"

const ArrowRightUp = ({ color = "#000", ...props }: IconProps) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M5.83203 14.1665L14.1654 5.83317M14.1654 5.83317H5.83203M14.1654 5.83317V14.1665"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default ArrowRightUp
