import { IconProps } from "./interfaces/IconProps.interface"

export const IconWarning = ({ color, size, forButtonIcon = false, style, ...props }: IconProps) => (
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
            translate: forButtonIcon ? (size === "ch" ? "-8% -4%" : "") : style?.translate ? style.translate : "",
        }}
        fill="none"
        width={24}
        height={21}
        {...props}
    >
        <path
            stroke={color || "#000000"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M10.615 2.892 2.39 17.098c-.456.788-.684 1.182-.65 1.506a1 1 0 0 0 .406.705c.263.191.718.191 1.629.191h16.45c.91 0 1.365 0 1.628-.191a1 1 0 0 0 .407-.705c.034-.324-.195-.718-.65-1.506L13.383 2.892c-.454-.785-.681-1.178-.978-1.31a1 1 0 0 0-.813 0c-.296.132-.523.525-.978 1.31Z"
        />
    </svg>
)

export default IconWarning
