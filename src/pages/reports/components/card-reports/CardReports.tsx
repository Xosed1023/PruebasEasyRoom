import { ReactNode } from "react"
import "./CardReports.css"

const CardReports = ({ children }: { children: ReactNode }) => {
    return <div className="card-reports">{children}</div>
}

export default CardReports
