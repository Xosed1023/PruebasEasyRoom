import React, { CSSProperties, ReactNode } from "react"

import "./ModalRow.css"

const ModalRow = ({
    children,
    style,
    className
}: {
    children?: JSX.Element | JSX.Element[] | boolean | boolean[] | ReactNode[]
    style?: CSSProperties
    className?: string
}) => {
    return (
        <div className={`modal-extra__row ${className || ""}`} style={style}>
            {children}
        </div>
    )
}

export default ModalRow
