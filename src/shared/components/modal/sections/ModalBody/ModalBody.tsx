import React, { CSSProperties, ReactNode } from "react"

import "./ModalBody.css"
import ModalRow from "../ModalRow/ModalRow"

const ModalBody = ({
    children,
    style,
    styleContent = {},
    className,
}: {
    children?: JSX.Element | JSX.Element[] | boolean | boolean[] | ReactNode[]
    style?: CSSProperties
    styleContent?: CSSProperties
    className?: string
}) => {
    return (
        <div className={`modal-extra__body ${className || ""}`} style={{ flex: 1, ...style }}>
            <ModalRow style={{ width: "95%", ...styleContent }}>{children}</ModalRow>
        </div>
    )
}

export default ModalBody
