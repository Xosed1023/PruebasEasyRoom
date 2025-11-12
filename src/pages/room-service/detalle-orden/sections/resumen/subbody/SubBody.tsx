import React, { ReactNode } from "react"

import "./SubBody.css"

const SubBody = ({children}: {children: ReactNode}) => {
    return (
        <div className="subbody-detalle-orden">
            <div className="subbody-detalle-orden__divider"></div>
            {children}
        </div>
    )
}

export default SubBody
