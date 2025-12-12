import React, { ReactNode } from "react"

import './Body.css'

const Body = ({ children }: { children: ReactNode }) => {
    return <div className="body-detalle-orden">{children}</div>
}

export default Body
