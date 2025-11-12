import React, { ReactNode } from "react"

import "./BoldText.css"

const BoldText = ({ children }: { children: ReactNode }) => {
    return <span className="modal--confirm--__helper__text--bold">{children}</span>
}

export default BoldText
