import { createPortal } from "react-dom"
import { Capacitor } from "@capacitor/core"
import cx from "classnames"
import BoldedText from "../bolded-text/BoldedText"
import styles from "./Snackbar.module.css"

const SnackbarOffline = ({ isOpen = true }) => {
    const portal = createPortal(
        <>
            {isOpen && (
                <div className={styles["snackbar__wrapper"]}>
                    <div
                        className={cx({
                            [styles["snackbar"]]: true,
                            [styles["snackbar-offline"]]: true,
                            [styles["snackbar-offline-ios"]]: Capacitor.getPlatform() === "ios",
                            [styles["snackbar--error"]]: true,
                        })}
                    >
                        <div className={styles["snackbar__content"]}>
                            <div className={styles["snackbar__text-container"]}>
                                <span
                                    className={cx({
                                        [styles["snackbar__title"]]: true,
                                        [styles["snackbar__title--error"]]: true,
                                    })}
                                >
                                    {"Sin conexión a internet"}
                                </span>

                                <BoldedText
                                    className={cx({
                                        [styles["snackbar__text"]]: true,
                                        [styles["snackbar__text--error"]]: true,
                                    })}
                                >
                                    {"Revisa tu conexión e inténtalo de nuevo."}
                                </BoldedText>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>,
        document.getElementById("snackbar-offline") as HTMLElement
    )
    return isOpen ? portal : null
}

export default SnackbarOffline
