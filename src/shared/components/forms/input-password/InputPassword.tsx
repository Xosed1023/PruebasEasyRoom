import { forwardRef, InputHTMLAttributes, Ref } from "react"
import { IconWarning } from "../../../icons/IconWarning"
import "./InputPassword.css"


export interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
    ref?: Ref<HTMLInputElement>
    label?: string
    hinttext?: string
    errorhinttext?: string
    error?: boolean
}

/**
 * @deprecated usar "\<InputText type="password" \/>" en su lugar
 */
export const InputPassword = forwardRef((
    props: InputPasswordProps,
    ref: Ref<HTMLInputElement>
) => {
    const { label, error, hinttext, errorhinttext } = props

    return (
        <div className="input-password__container">
            <label className="input-password__label">{label}</label>
            <div className="input-password__wrapper">
                <input
                    {...{ 
                        ...props, 
                        error: String(error), 
                        className: `input-password ${error ? "input-password--error" : ""} ${props.className}`, 
                        type: 'password',
                        ref,
                        style: {
                            paddingRight: error ? "30px" : "",
                            ...props.style
                        }
                    }}
                />
                {error ? (
                    <div className="input-password__icon">
                        <IconWarning color="var(--red-danger)" />
                    </div>
                ) : null}
            </div>
            <span className={`input-password__hint ${error ? "input-password__hint--error" : ""}`}>{error ? errorhinttext : hinttext}</span>
        </div>
    )
})

export default InputPassword
