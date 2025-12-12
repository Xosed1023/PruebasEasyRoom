import React, { ReactNode, CSSProperties } from "react"

import "./FormRow.css"

const FormRow = ({
    children,
    justifyContent,
    marginBottom
}: {
    children: ReactNode
    justifyContent?: CSSProperties["justifyContent"]
    marginBottom?: CSSProperties["marginBottom"]
}) => {
    return (
        <div className="form-section__inventory__row" style={{ justifyContent: justifyContent, marginBottom: marginBottom }}>
            {children}
        </div>
    )
}

export default FormRow
