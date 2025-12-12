import { IconProps } from "./interfaces/IconProps.interface"

export const IconSuccess = ({ color, size, forButtonIcon = false, style, ...props }: IconProps) => (
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
            translate: forButtonIcon ? (size === "ch" ? "-11% -13%" : "") : style?.translate ? style.translate : "",
        }}
        width={24}
        height={24}
        fill="none"
        {...props}
    >
        <path
            stroke={color || "#000000"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m7.5 12.5 3 3 6-6m5.5 3c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10Z"
        />
    </svg>
)
export default IconSuccess
