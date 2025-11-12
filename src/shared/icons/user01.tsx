import { IconProps } from "./interfaces/IconProps.interface"

export const user01 = ({ className, color, size, forButtonIcon = false, style, ...props }: IconProps) => (
    <svg
        className={className}
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
        width={"1em"}
        height={"1em"}
        {...props}
    >
        <path
            stroke={color || "#000000"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.667}
            d="M14.667 16.5c0-1.163 0-1.745-.144-2.218a3.333 3.333 0 0 0-2.222-2.222c-.473-.143-1.055-.143-2.218-.143H5.917c-1.163 0-1.745 0-2.218.143a3.333 3.333 0 0 0-2.222 2.222c-.144.473-.144 1.055-.144 2.218M11.75 5.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        />
    </svg>
)

export default user01
