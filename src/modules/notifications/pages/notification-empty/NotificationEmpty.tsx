import emptyMessages from "assets/png/empty-messages.png"
import styles from "./NotificationEmpty.module.css"

export const NotificationEmpty = () => {
    return (
        <div className={styles["notification-empty__container"]}>
            <div className={styles["notification-empty__content"]}>
                <img
                    className={styles["notification-empty__image"]}
                    height={44}
                    src={emptyMessages}
                    alt="emptyMessages"
                />
                <h3 className={styles["notification-empty__title"]}>Sin novedades por ahora</h3>
                <p className={styles["notification-empty__description"]}>
                    Te notificaremos cuando hay algo importante para tu hotel.
                </p>
            </div>
        </div>
    )
}
