import { IconProps } from "./interfaces/IconProps.interface"

const IconHelp = ({ color, size, forButtonIcon = false, style, ...props }: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
            transform: forButtonIcon
                ? size === "ch"
                    ? "scale(1)"
                    : "scale(1.2)"
                : style?.transform
                ? style?.transform
                : "",
            translate: forButtonIcon ? (size === "ch" ? "-5% -5%" : "4% 5%") : style?.translate ? style.translate : "",
        }}
        fill="none"
        width={24}
        height={24}
        {...props}
    >
        <path
            stroke={color || "#000000"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.09 8a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01M21 11c0 5.523-4.477 10-10 10S1 16.523 1 11 5.477 1 11 1s10 4.477 10 10Z"
        />
    </svg>
)
export default IconHelp
