import { ReactNode } from "react"
import './HeaderLeft.css'

const HeaderLeft = ({ children, label }: { children: ReactNode, label?: string }) => {
    return (
        <div className="reports__header-left__container">
            <span className="reports__header-left--normal">{label || "Fecha:\u00A0"}</span>
            <span className="reports__header-left--bold">{children}</span>
        </div>
    )
}

export default HeaderLeft
