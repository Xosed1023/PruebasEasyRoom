import { IconProps } from "./interfaces/IconProps.interface"

export const CheckSvg = ({ color, size, forButtonIcon = false, style, ...props }: IconProps) => (
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
            translate: forButtonIcon ? (size === "ch" ? "11% 5%" : "20% 15%") : style?.translate ? style.translate : "",
        }}
        fill="none"
        {...props}
    >
        <path
            stroke={color || "#000000"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.667}
            d="M14.667 1 5.5 10.167 1.333 6"
        />
    </svg>
)

export default CheckSvg
