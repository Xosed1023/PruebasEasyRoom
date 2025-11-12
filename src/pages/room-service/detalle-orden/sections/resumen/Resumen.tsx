import React, { ReactNode } from "react"
import "./Resumen.css"
const Resumen = ({ children }: { children: ReactNode }) => {
    return <div className="resumen-detalle-orden">{children}</div>
}

export default Resumen
