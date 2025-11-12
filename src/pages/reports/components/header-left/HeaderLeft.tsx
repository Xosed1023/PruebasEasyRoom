import { ReactNode } from "react"
import './HeaderLeft.css'

const HeaderLeft = ({ children }: { children: ReactNode }) => {
    return (
        <div className="reports__header-left__container">
            <span className="reports__header-left--normal">Fecha:&nbsp;</span>
            <span className="reports__header-left--bold">{children}</span>
        </div>
    )
}

export default HeaderLeft
