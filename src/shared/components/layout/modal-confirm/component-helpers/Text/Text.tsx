import React, { ReactNode } from "react"

import "./Text.css"

const Text = ({ children }: { children: ReactNode }) => {
    return <span className="modal--confirm--__helper__text">{children}</span>
}

export default Text
