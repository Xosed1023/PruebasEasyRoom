import { useToggleFlag } from "src/shared/hooks/useToggleFlag"

import "./Wrapper.css"
import { WrapperProps } from "./Wrapper.type"

const Wrapper = ({
    children,
    bgColor = "var(--white)",
    alertBgColor1,
    alertBgColor2,
    className,
    style,
}: WrapperProps) => {
    const [isFirstColor] = useToggleFlag(true)

    return (
        <div
            className={`room-card--mxl__wrapper ${className || ""}`}
            style={{
                backgroundColor:
                    alertBgColor1 && alertBgColor2 ? (isFirstColor ? alertBgColor1 : alertBgColor2) : bgColor,
                ...style,
            }}
        >
            {children}
        </div>
    )
}

export default Wrapper
