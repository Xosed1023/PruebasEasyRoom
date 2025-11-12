import { useEffect, useRef, useState } from "react"
import cx from "classnames"
import { PropsToolTip } from "./Tooltip.type"
import "./Tooltip.css"
import { computePosition, flip, shift } from "@floating-ui/react"

function Tooltip({
    className = "",
    style = {},
    title = "",
    description = "",
    children,
    theme = "light",
    placement = "top",
}: PropsToolTip): JSX.Element {
    const ref = useRef<HTMLDivElement>(null)
    const floatingRef = useRef<HTMLDivElement>(null)

    const [isOpen, setisOpen] = useState(false)

    // acomodar la lista flotante del dropdown
    useEffect(() => {
        if (!ref.current || !floatingRef.current) {
            return
        }
        computePosition(ref.current, floatingRef.current, {
            placement: "bottom",
            middleware: [flip(), shift()],
        }).then(({ x, y }) => {
            if(floatingRef.current) {
                Object.assign(floatingRef.current.style, {
                    top: `${y + 5}px`,
                    left: `${x}px`,
                })
            }
        })
    }, [isOpen])

    return (
        <div className={"tooltip"} style={style}>
            {isOpen && (
                <div
                    ref={floatingRef}
                    className={cx({
                        "tooltip-box": true,
                        "tooltip-box_size_lg": description,
                        "tooltip-box_theme_light": theme === "light",
                        "tooltip-box_theme_dark": theme === "dark",
                        [className]: className,
                    })}
                >
                    <p className="tooltip__title">{title}</p>
                    {description && <p className="tooltip__description">{description}</p>}
                </div>
            )}
            <div ref={ref} onMouseEnter={() => setisOpen(true)} onMouseLeave={() => setisOpen(false)}>
                {children}
            </div>
        </div>
    )
}

export default Tooltip
