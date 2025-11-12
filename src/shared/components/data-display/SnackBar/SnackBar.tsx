import { createPortal } from "react-dom"
import Icon from "src/shared/icons"
import cx from "classnames"
import { ComponentProps } from "src/types/component"
import "./SnackBar.css"

export interface SnackBarProps extends ComponentProps {
    title: string
    children: JSX.Element
    isOpen?: boolean
    onClose?: () => void
    status: "success" | "error" | ""
}

const SnackBar = ({ title, children, isOpen = true, onClose, status, className = "", style = {} }: SnackBarProps) => {
    const portal = createPortal(
        <>
            {isOpen && (
                <div
                    className={cx({
                        snackbar__wrapper: true,
                        "snackbar__wrapper--success": status === "success",
                        "snackbar__wrapper--error": status === "error",
                        [className]: className,
                    })}
                >
                    <div
                        className={cx({
                            snackbar: true,
                            "snackbar--success": status === "success",
                            "snackbar--error": status === "error",
                        })}
                        onClick={onClose}
                        style={style}
                    >
                        <div className="snackbar__icon__container">
                            <div
                                className={cx({
                                    snackbar__icon__wave1: true,
                                    "snackbar__icon__wave1--success": status === "success",
                                    "snackbar__icon__wave1--error": status === "error",
                                })}
                            >
                                <div
                                    className={cx({
                                        snackbar__icon__wave2: true,
                                        "snackbar__icon__wave2--success": status === "success",
                                        "snackbar__icon__wave2--error": status === "error",
                                    })}
                                >
                                    <div
                                        className={cx({
                                            snackbar__icon__wrapper: true,
                                            "snackbar__icon__wrapper--success": status === "success",
                                            "snackbar__icon__wrapper--error": status === "error",
                                        })}
                                    >
                                        <Icon
                                            name={status === "success" ? "check" : "Warning"}
                                            color={status === "success" ? "var(--white)" : "var(--error)"}
                                            width={status === "success" ? 10 : 20}
                                            height={status === "success" ? 10 : 20}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="snackbar__content">
                            <span
                                className={cx({
                                    snackbar__title: true,
                                    "snackbar__title--success": status === "success",
                                    "snackbar__title--error": status === "error",
                                })}
                            >
                                {title}
                            </span>
                            <div
                                className={cx({
                                    "snackbar__content__children--success": status === "success",
                                    "snackbar__content__children--error": status === "error",
                                })}
                            >
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>,
        document.getElementById("snackbar") as HTMLElement
    )
    return isOpen ? portal : null
}

export default SnackBar
