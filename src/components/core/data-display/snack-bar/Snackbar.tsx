import { createPortal } from "react-dom"
import { Capacitor } from "@capacitor/core"
import cx from "classnames"
import Icon from "@/icons"
import BoldedText from "../bolded-text/BoldedText"
import { SnackbarProps } from "./Snackbar.type"
import styles from "./Snackbar.module.css"

const Snackbar = ({
    title = "",
    text = "",
    children,
    isOpen = true,
    onClose,
    status = "success",
    className = "",
    style = {},
    containerStyle = {},
    image = "",
    close = true,
}: SnackbarProps) => {
    const portal = createPortal(
        <>
            {isOpen && (
                <div style={containerStyle} className={styles["snackbar__wrapper"]}>
                    <div
                        className={cx({
                            [styles["snackbar"]]: true,
                            [styles["snackbar-ios"]]: Capacitor.getPlatform() === "ios",
                            [styles["snackbar--success"]]: status === "success",
                            [styles["snackbar--error"]]: status === "error",
                            [className]: className,
                        })}
                        style={style}
                    >
                        {close && (
                            <Icon
                                className={styles["snackbar__icon"]}
                                name={"Close"}
                                height={20}
                                width={20}
                                color={status == "error" ? "#EB5757" : "#0E0E0E"}
                                onClick={onClose}
                            />
                        )}
                        <div className={styles["snackbar__content"]}>
                            {image && <img src={image} alt="snackbar" className={styles["snackbar__image"]} />}
                            <div className={styles["snackbar__text-container"]}>
                                <span
                                    className={cx({
                                        [styles["snackbar__title"]]: true,
                                        [styles["snackbar__title--success"]]: status === "success",
                                        [styles["snackbar__title--error"]]: status === "error",
                                    })}
                                >
                                    {title}
                                </span>
                                {children ? (
                                    children
                                ) : (
                                    <BoldedText
                                        className={cx({
                                            [styles["snackbar__text"]]: true,
                                            [styles["snackbar__text--success"]]: status === "success",
                                            [styles["snackbar__text--error"]]: status === "error",
                                        })}
                                    >
                                        {text}
                                    </BoldedText>
                                )}
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

export default Snackbar
