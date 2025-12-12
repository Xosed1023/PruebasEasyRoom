import { useState } from "react"
import { InputText } from "src/shared/components/forms"
import { InputTextProps } from "src/shared/components/forms/input-text/input-text.props"
import Icon from "src/shared/icons"

export const InputPassword = ({ value = "", onChange, error, errorhinttext, label}: InputTextProps) => {
    const [type, setType] = useState<"text" | "password">("password")
    return (
        <div className="login-screen__input login-screen__password">
            <InputText
                className="login-screen__input-password"
                icon={Icon}
                iconProps={{ name: "lock", width: 24, height: 24 }}
                type={type}
                label={label ? label : "Password"}
                data-testid="password"
                placeholder="Ingresa tu contraseña"
                value={value}
                onChange={onChange}
                error={error}
                errorhinttext={errorhinttext}
            />
            <Icon
                name={type === "password" ? "eyeOff" : "eye"}
                className="login-screen__input-password__icon"
                onClick={() => (type === "password" ? setType("text") : setType("password"))}
            />
        </div>
    )
}
