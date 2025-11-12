import React, { useRef, useState, forwardRef } from "react"
import "./SecurityCode.css"

// Definimos el tipo de las props del componente
type SecurityCodeInputProps = {
    onSubmit: (code: number) => boolean
    loading: boolean
    passCheck: boolean
    disabled?: boolean
    password?: boolean
    errorHintText?: string
}

const SecurityCodeInput = forwardRef<HTMLInputElement, SecurityCodeInputProps>(
    ({ onSubmit, loading, passCheck, disabled, password, errorHintText }, ref) => {
        const [digits, setDigits] = useState(["", "", "", ""])
        const inputsRefs = [
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null),
            useRef<HTMLInputElement | null>(null),
        ]
        const [verificacion, setVerificacion] = useState(false)

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
            const newDigits = [...digits]
            console.log(e.key, index)
            if (e.key === "Backspace" && !loading) {
                if (digits[index] !== "") {
                    newDigits[index] = ""
                    setDigits(newDigits)
                } else if (digits[index] === "") {
                    if (index > 0) {
                        inputsRefs[index - 1].current?.focus()
                    }
                }
            } else if (e.key === "ArrowRight" && index < 3 && inputsRefs[index + 1]?.current) {
                inputsRefs[index + 1].current?.focus()
            } else if (e.key === "ArrowLeft" && index > 0 && inputsRefs[index - 1]?.current) {
                inputsRefs[index - 1].current?.focus()
            } else {
                newDigits[index] = e.key.replace(/[^0-9]/g, "")
                if (newDigits[index] !== "") {
                    setDigits(newDigits)
                    if (index < 3) {
                        inputsRefs[index + 1].current?.focus()
                    }
                    if (newDigits.every((digit) => digit !== "")) {
                        const code = Number(newDigits.join(""))
                        setTimeout(() => {
                            if (!onSubmit(code) && !loading) {
                                verificacionDenegada()
                            }
                        }, 1)
                    }
                }
            }
        }

        const verificacionDenegada = () => {
            setVerificacion(true)
            const newDigits = [...digits]
            newDigits.forEach((digit, index) => {
                newDigits[index] = ""
                setDigits(newDigits)
            })
            inputsRefs[0].current?.focus()
        }

        const paswsord = (digit) => {
            if (digit) {
                if (password) {
                    return "*"
                }
                return digit
            }
        }
        return (
            <div className="security-code-input__container">
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: "10px",
                    }}
                >
                    {digits.map((digit, index) => (
                        <input
                            className={`security-code-input ${password && digit ? "pass" : ""} ${
                                digit ? "has-value" : ""
                            } ${verificacion ? "verificado" : ""}
                        ${passCheck && !loading ? "check" : ""}`}
                            placeholder={"0"}
                            autoFocus={index === 0}
                            key={index}
                            id={`input-${index}`}
                            type={"text"}
                            maxLength={1}
                            disabled={disabled}
                            required={true}
                            value={paswsord(digit)}
                            readOnly={loading}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={inputsRefs[index]}
                            style={{ borderColor: errorHintText && !digit ? "var(--pink-ocupado)" : "" }}
                        />
                    ))}
                </div>
                {!!errorHintText && <div className="security-code-hint__text--error">{errorHintText}</div>}
            </div>
        )
    }
)

export default SecurityCodeInput
