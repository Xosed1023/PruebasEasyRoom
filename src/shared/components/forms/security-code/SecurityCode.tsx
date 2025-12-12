import { useRef, useState } from "react"
import "./SecurityCode.css"
import { Button } from "../../forms"
import { useEffectClickOutside } from "src/shared/hooks"
import { SecurityCodeProps } from "./types/security-code"
import SecurityCodeInput from "./SecurityCode_input"
import Icon from "src/shared/icons"

export const SecurityCode = (props: SecurityCodeProps) => {
    const {
        cancelButtonTheme = "secondary",
        cancelButtonStyle,
        onCloseDialog,
        onConfirm,
        disabled,
        returnValue,
        ...rest
    } = props
    const dialogRef = useRef<HTMLDialogElement | null>(null)
    const [passCheck, setPasCheck] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = (securityCode: number) => {
        if (returnValue) returnValue(securityCode)
        setLoading(true)
        const validCode = 1234 // Código válido de ejemplo
        const isValid = securityCode === validCode
        if (isValid) {
            // Realizar el submit
            setPasCheck(true)
            onConfirm?.({ passcode: true })

            close()
        } else {
            onConfirm?.({ passcode: false })

            setPasCheck(false)
            // Mostrar un mensaje de error o realizar otras acciones
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
        return isValid
    }

    const close = () => {
        dialogRef.current?.close()
        onCloseDialog?.({ confirmed: false })
    }

    useEffectClickOutside(dialogRef, close)

    return (
        <>
            <div className="modal-security-code">
                <dialog className="modal-security-code__content" ref={dialogRef} open {...(rest as any)}>
                    <div className="modal-security-code__header">
                        <span className="modal-security-code__title">{props.title}</span>
                        {passCheck && !loading && (
                            <Icon
                                className="modal-security-code__icon"
                                name={"lockUnLocked04"}
                                color={"#079455"}
                                width={"2rem"}
                                height={"2rem"}
                            />
                        )}
                        {((!passCheck && !loading) || (passCheck && loading) || (!passCheck && loading)) && (
                            <Icon
                                className="modal-security-code__icon"
                                name={"lock04"}
                                color={"#D92D20"}
                                width={"2rem"}
                                height={"2rem"}
                            />
                        )}
                        <form>
                            <SecurityCodeInput
                                onSubmit={onSubmit}
                                loading={loading}
                                passCheck={passCheck}
                                disabled={disabled}
                                password={props.password}
                            />
                        </form>
                        <div className="modal-security-code__message">
                            {!passCheck && !loading && "Ingresa tu pin"}
                            {loading && (
                                <div className="item">
                                    <div className="loader-pulse"></div>
                                </div>
                            )}
                            {passCheck && !loading && "Pin correcto"}
                        </div>
                    </div>
                    <div className="modal-security-code__divider"></div>
                    <div className="modal-security-code__footer">
                        <Button text="Cancelar" theme={cancelButtonTheme} style={cancelButtonStyle} onClick={close} />
                    </div>
                </dialog>
            </div>
        </>
    )
}
