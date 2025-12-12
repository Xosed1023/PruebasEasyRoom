import { CSSProperties, DialogHTMLAttributes, LegacyRef, useEffect, useMemo, useRef, useState } from "react"
import "./ModalConfirm.css"
import { Button } from "../../forms"
import { IconTheme } from "./types/theme.type"
import { selectIconThemeClass } from "./helpers/theme"
import { useEffectClickOutside } from "src/shared/hooks"
import { Modal } from "../modal/Modal"

export interface ModalConfirmProps extends DialogHTMLAttributes<HTMLDialogElement> {
    ref?: LegacyRef<HTMLDialogElement>
    title: string
    description?: string | JSX.Element
    icon: JSX.Element
    // para el fondo redondo del ícono
    iconTheme?: IconTheme
    cancelButtonTheme?: "primary" | "secondary" | "secondary-gray" | "tertiary" | "tertiary-gray"
    confirmButtonTheme?: "primary" | "secondary" | "secondary-gray" | "tertiary" | "tertiary-gray"
    cancelButtonStyle?: CSSProperties
    cancelButtonText?: string
    confirmButtonStyle?: CSSProperties
    confirmButtonText?: string 
    onCloseDialog?: ({ confirmed }: { confirmed: boolean }) => void
    isOpen?: boolean
    confirmLabel?: string
    className?: string
    width?: number | string
    height?: number | string
    acceptButton?: boolean
    onSecondaryButtonClick?: () => void 
}

export const ModalConfirm = (props: ModalConfirmProps) => {
    const {
        iconTheme,
        cancelButtonTheme = "secondary",
        cancelButtonText = "Cancelar",
        confirmButtonTheme = "primary",
        cancelButtonStyle,
        confirmButtonStyle,
        confirmButtonText, 
        onCloseDialog,
        confirmLabel = "Confirmar",
        className = "",
        width = 572,
        height = "fit-content",
        acceptButton = false,
        onSecondaryButtonClick,
    } = props

    const iconClassTheme = useMemo(() => selectIconThemeClass(iconTheme), [iconTheme])

    const dialogRef = useRef<HTMLDialogElement | null>(null)

    const [isOpen, setIsOpen] = useState(props.isOpen)

    useEffect(() => {
        setIsOpen(props.isOpen)
    }, [props.isOpen])

    const cancel = () => {
        dialogRef.current?.close()
        onCloseDialog?.({ confirmed: false })
        setIsOpen(false)
    }

    const confirm = () => {
        dialogRef.current?.close()
        onCloseDialog?.({ confirmed: true })
        setIsOpen(false)
    }
    const handleSecondaryButtonClick = () => {
        if (onSecondaryButtonClick) {
            onSecondaryButtonClick() 
        } else {
            cancel() 
        }
    }

    useEffectClickOutside(dialogRef, cancel)

    return (
        <Modal
            isOpen={isOpen}
            isCancelableOnClickOutside
            onClose={() => cancel()}
            className={className}
            withCloseButton
            width={width}
            height={height}
        >
            <div className="modal--confirm__header">
                <div className={`modal--confirm__icon ${iconClassTheme}`}>{props.icon}</div>
                <span className="modal--confirm__title">{props.title}</span>
            </div>
            <div className="modal--confirm__body">
                <span className="modal--confirm__description">{props.description}</span>
            </div>
            <div className="modal--confirm__divider"></div>
            <div className="modal--confirm__footer">
                {!acceptButton && (
                    <Button
                        type={"button"}
                        className="modal--confirm__footer__button"
                        text={cancelButtonText}
                        theme={cancelButtonTheme}
                        style={cancelButtonStyle}
                        onClick={handleSecondaryButtonClick}
                    />
                )}
                <Button
                    type={"button"}
                    className="modal--confirm__footer__button"
                    text={confirmButtonText || confirmLabel} 
                    theme={confirmButtonTheme}
                    style={confirmButtonStyle}
                    onClick={confirm}
                />
            </div>
        </Modal>
    )
}