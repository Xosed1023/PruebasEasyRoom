import React, { CSSProperties, FormHTMLAttributes, ReactNode } from "react"

import "./ModalContent.css"

const ModalContent = ({
    children,
    className,
    style,
    isForm = false,
    formProps,
}: {
    children?: JSX.Element | JSX.Element[] | boolean | boolean[] | ReactNode[]
    className?: string
    isForm?: boolean
    style?: CSSProperties
    formProps?: FormHTMLAttributes<HTMLFormElement>
}) => {
    return isForm ? (
        <form {...formProps} className={`modal-extra__content ${className ? className : ""}`} style={style}>
            {children}
        </form>
    ) : (
        <div className={`modal-extra__content ${className ? className : ""}`} style={style}>
            {children}
        </div>
    )
}

export default ModalContent
