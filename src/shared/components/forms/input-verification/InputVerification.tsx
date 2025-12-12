import cx from "classnames"
import VerificationInput from "react-verification-input"
import { Props } from "./InputVerification.type"
import "./InputVerification.css"

function InputVerification({
    className = "",
    style = {},
    label = "Código de verificación",
    error = false,
    hintText = "Escribe el código",
    onChange,
    onCompleteChange = undefined,
    hintAlignment = "left",
    value,
}: Props): JSX.Element {
    return (
        <div className={cx("input-verification", className)} style={style}>
            {label && <p className="input-verification__label">{label}</p>}
            <VerificationInput
                autoFocus={true}
                classNames={{
                    container: "input-verification__contain",
                    character: cx({
                        "input-verification__character": true,
                        "input-verification__character--error": error,
                    }),
                    characterInactive: cx({
                        "input-verification__character--inactive": true,
                    }),
                    characterSelected: "input-verification__character--selected",
                }}
                placeholder="0"
                validChars="0-9"
                value={value}
                inputProps={{ inputMode: "numeric", autoComplete: "new-password" }}
                length={4}
                passwordMode={true}
                onChange={(value) => onChange(value)}
                onComplete={(value) => {
                    if (onCompleteChange) onCompleteChange(value)
                }}
            />
            {hintText && (
                <p
                    className={cx({
                        "input-verification__hint": true,
                        "input-verification__hint--error": error,
                        "input-verification__hint--center": hintAlignment === "center",
                    })}
                >
                    {hintText}
                </p>
            )}
        </div>
    )
}

export default InputVerification
