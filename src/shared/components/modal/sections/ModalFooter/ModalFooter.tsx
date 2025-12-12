import React, { CSSProperties, ReactNode } from "react"

import "./ModalFooter.css"
import ModalRow from "../ModalRow/ModalRow"

const ModalFooter = ({
    children,
    style,
    className,
}: {
    children?: JSX.Element | JSX.Element[] | boolean | boolean[] | ReactNode[]
    style?: CSSProperties
    className?: string
}) => {
    return (
        <ModalRow style={style} className={`modal-row__footer ${className || ""}`}>
            <>
                <div className="modal-row__divider"></div>
                {children}
            </>
        </ModalRow>
    )
}

export default ModalFooter
