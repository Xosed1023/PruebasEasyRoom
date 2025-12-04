import { IconProps } from "./Icon.type"

const ArrowLeft = ({ color = "#000", ...props }: IconProps) => {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M22.1654 14H5.83203M5.83203 14L13.9987 22.1666M5.83203 14L13.9987 5.83331"
                stroke={color}
                strokeWidth="2.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default ArrowLeft
