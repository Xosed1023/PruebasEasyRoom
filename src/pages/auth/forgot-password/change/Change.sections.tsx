import { useState } from "react"
import { InputText } from "src/shared/components/forms"
import { InputTextProps } from "src/shared/components/forms/input-text/input-text.props"
import Icon from "src/shared/icons"
import cx from "classnames"

export const InputPassword = ({
    value = "",
    label = "",
    placeholder = "",
    onChange,
    error,
    errorhinttext,
    className = "",
}: InputTextProps) => {
    const [type, setType] = useState<"text" | "password">("password")
    return (
        <div className={cx("change-screen__password", className)}>
            <InputText
                type={type}
                label={label}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                error={error}
                errorhinttext={errorhinttext}
            />
            <Icon
                name={type === "password" ? "eyeOff" : "eye"}
                className="change-screen__input-password__icon"
                onClick={() => (type === "password" ? setType("text") : setType("password"))}
            />
        </div>
    )
}
