import { useEffect, useState, ReactNode } from "react"
import cx from "classnames"
import "./Turno.css"

interface TurnoProps {
    folioTurno: string | null
    size?: "normal" | "large"
    showDuration?: number
    isModal?: boolean
    children?: ReactNode
}

export default function Turno({ folioTurno, size = "normal", showDuration, isModal = false, children }: TurnoProps) {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        if (showDuration && folioTurno) {
            setVisible(true)
            const timer = setTimeout(() => setVisible(false), showDuration)
            return () => clearTimeout(timer)
        } else {
            setVisible(true)
        }
    }, [folioTurno, showDuration])

    if (!folioTurno || !visible) return null

    const content = (
        <div className={cx("disp__turn-wrapper", { "disp__turn-wrapper--large": size === "large" })}>
            <p className={cx("disp__turn", { "disp__turn--large": size === "large" })}>
                Turno:
                <br />
                <strong>{folioTurno}</strong>
            </p>
            {children && <div className="disp__turn-extra">{children}</div>}
        </div>
    )

    if (isModal) {
        return (
            <div className="modal-turn-overlay">
                <div className="modal-turn-content">{content}</div>
            </div>
        )
    }

    return content
}
