import cx from "classnames"
import { DialogHTMLAttributes, LegacyRef, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import IconBorder from "../../data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import "./Modal.css"
import Xclose from "src/shared/icons/xclose"

export interface ModalProps extends DialogHTMLAttributes<HTMLDialogElement> {
    ref?: LegacyRef<HTMLDialogElement>
    isOpen?: boolean
    withCloseButton?: boolean
    withBackButton?: boolean
    children?: React.ReactNode
    width?: number | string
    height?: number | string
    maxWidth?: number | string
    maxHeight?: number | string
    isCancelableOnClickOutside?: boolean
    onClose?: () => void
    onBack?: () => void
    onClick?: () => void
}

export const Modal = ({ isOpen, ...props }: ModalProps) => {
    const {
        className = "",
        withCloseButton,
        children,
        width,
        height,
        isCancelableOnClickOutside = true,
        onClose = undefined,
        onBack,
        withBackButton,
        maxWidth,
        maxHeight,
        ...rest
    } = props
    const dialogRef = useRef<HTMLDialogElement | null>(null)

    const [isOpenState, setIsOpen] = useState(isOpen)

    useEffect(() => {
        setIsOpen(isOpen)
    }, [isOpen])

    const cancel = () => {
        if (isCancelableOnClickOutside) {
            dialogRef.current?.close()
            setIsOpen(false)
            handleClose()
        }
    }

    const handleClose = () => {
        if (onClose) onClose()
    }

    const portal = createPortal(
        <div className={`modal ${!isOpen ? "open" : ""}`} onClick={(e) => {
            if (e.target === e.currentTarget) {
                cancel()
            }
        }}>
            <dialog
                className={cx("modal__content", className)}
                ref={dialogRef}
                open
                {...(rest as any)}
                style={{ width, height, maxWidth, maxHeight, ...rest.style }}
            >
                {withBackButton && (
                    <div
                        className="modal__back"
                        onClick={() => {
                            onBack?.()
                        }}
                    >
                        <IconBorder primaryBgColor="var(--fondo-close)" primaryBgDiameter={35}>
                            <Icon name="arrowLeft" color="var(--deep-purple)" width={18} height={18} />
                        </IconBorder>
                    </div>
                )}
                {withCloseButton && (
                    <div
                        className="modal__close"
                        onClick={() => {
                            setIsOpen(false)
                            handleClose()
                        }}
                    >
                        <Xclose width={15} height={15} />
                    </div>
                )}
                {children}
            </dialog>
        </div>,
        document.getElementById("modal") as HTMLElement
    )

    return isOpenState ? portal : null
}
