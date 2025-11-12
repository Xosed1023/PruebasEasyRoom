import React from "react"
import { createPortal } from "react-dom"
import Icon from "src/shared/icons"
import cx from "classnames"

import "./MiniSnackbar.css"

const MiniSnackBar = ({
    title,
    children,
    isOpen = true,
    onClose,
    status,
}: {
    title: string
    children: JSX.Element
    isOpen?: boolean
    onClose: () => void
    status: "success" | "error" | ""
}) => {
    const portal = createPortal(
        <>
            {isOpen && (
                <div
                    className={cx({
                        "mini-snackbar__wrapper": true,
                        "snackbar__wrapper--success": status === "success",
                        "snackbar__wrapper--error": status === "error",
                    })}
                >
                    <div
                        className={cx({
                            "mini-snackbar": true,
                            "mini-snackbar--success": status === "success",
                            "mini-snackbar--error": status === "error",
                        })}
                        onClick={onClose}
                    >
                        <div className="mini-snackbar__icon__container">
                            <div
                                className={cx({
                                    "mini-snackbar__icon__wave1": true,
                                    "mini-snackbar__icon__wave1--success": status === "success",
                                    "mini-snackbar__icon__wave1--error": status === "error",
                                })}
                            >
                                <div
                                    className={cx({
                                        "mini-snackbar__icon__wave2": true,
                                        "mini-snackbar__icon__wave2--success": status === "success",
                                        "mini-snackbar__icon__wave2--error": status === "error",
                                    })}
                                >
                                    <div
                                        className={cx({
                                            "mini-snackbar__icon__wrapper": true,
                                            "mini-snackbar__icon__wrapper--success": status === "success",
                                            "mini-snackbar__icon__wrapper--error": status === "error",
                                        })}
                                    >
                                        <Icon
                                            name={status === "success" ? "check" : "Warning"}
                                            color={status === "success" ? "var(--white)" : "var(--error)"}
                                            width={10}
                                            height={10}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="snackbar__content">
                            <span
                                className={cx({
                                    "mini-snackbar__title": true,
                                    "mini-snackbar__title--success": status === "success",
                                    "mini-snackbar__title--error": status === "error",
                                })}
                            >
                                {title}
                            </span>
                            <div
                                className={cx({
                                    "mini-snackbar__content__children--success": status === "success",
                                    "mini-snackbar__content__children--error": status === "error",
                                })}
                            >
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>,
        document.getElementById("mini-snackbar") as HTMLElement
    )
    return isOpen ? portal : null
}

export default MiniSnackBar
