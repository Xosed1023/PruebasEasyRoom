import React, { CSSProperties } from "react"

import "./FormSectionRow.css"

const FormSectionRow = ({ children, style }: { children: JSX.Element[] | JSX.Element | (JSX.Element | boolean)[] | boolean, style?: CSSProperties }) => {
    return <div className="venta-habitacion__form-section__row" style={style}>{children}</div>
}

export default FormSectionRow
