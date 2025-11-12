import cx from "classnames"
import { useState, useRef } from "react"
import { Props } from "./DropdownMenu.type"
import "./DropdownMenu.css"
import { useOutside } from "src/shared/hooks/handle-click-outside"

function DropdownMenu(props: Props): JSX.Element {
    const { className = "", containerClassName = "", children, items = [], config = { top: 0, left: 0 } } = props
    const [visible, setVisible] = useState<boolean>(false)

    const dropRef = useRef<HTMLDivElement>(null)
    const elementRef = useRef<HTMLDivElement>(null)
    const ref = elementRef.current

    useOutside(dropRef, () => setVisible(false))

    return (
        <>
            <div className={containerClassName} ref={elementRef} onClick={() => setVisible(true)}>
                {children}
            </div>
            {visible && (
                <div
                    ref={dropRef}
                    className={cx("dropdown-menu", visible ? "dropdown-menu__animation" : "", className)}
                    style={{
                        top: Number(ref?.offsetTop) + Number(ref?.offsetHeight) + config.top,
                        left:
                            Number(ref?.offsetLeft) -
                                (config.left > 0 ? config.left : Number(dropRef.current?.offsetWidth)) || undefined,
                    }}
                >
                    {items?.map(({ label = "", onClick, disabled }, index) => (
                        <div
                            className="dropdown-menu__item"
                            key={index}
                            onClick={() => {
                                if (!disabled) {
                                    setVisible(false)
                                    onClick()
                                }
                            }}
                            style={{ opacity: disabled ? 0.5 : 1 }}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default DropdownMenu
