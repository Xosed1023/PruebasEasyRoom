import React, { FormHTMLAttributes, ReactNode } from "react"

import "./FormWrapper.css"
interface FormWrapperProps extends FormHTMLAttributes<HTMLFormElement> {
    children: ReactNode
    inputImage?: ReactNode
}

const FormWrapper = ({ children, inputImage, ...formProps }: FormWrapperProps) => {
    return (
        <form className="form-section__inventory__wrapper" {...formProps}>
            {inputImage && <div className="form-section__inventory__section__image">{inputImage}</div>}
            <div className="form-section__inventory__section">{children}</div>
        </form>
    )
}

export default FormWrapper
