import { useDoubleTap } from "src/shared/hooks/useHandleDoubleTap"
import { useToggleFlag } from "src/shared/hooks/useToggleFlag"

import "./Wrapper.css"
import { WrapperProps } from "./Wrapper.type"

const Wrapper = ({
    children,
    bgColor = "var(--white)",
    alertBgColor1,
    alertBgColor2,
    onSelect,
    className,
    style,
}: WrapperProps) => {
    const [isFirstColor] = useToggleFlag(true)
    const doubleTapHandler = useDoubleTap(onSelect || (() => null))

    return (
        <div
            className={`room-card--xl__wrapper ${className || ""}`}
            style={{
                backgroundColor:
                    alertBgColor1 && alertBgColor2 ? (isFirstColor ? alertBgColor1 : alertBgColor2) : bgColor,
                ...style,
            }}
            onDoubleClick={onSelect}
            onTouchEnd={doubleTapHandler}
        >
            {children}
        </div>
    )
}

export default Wrapper
