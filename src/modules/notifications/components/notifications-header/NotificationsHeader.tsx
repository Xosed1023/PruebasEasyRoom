import { useNavigate } from "react-router"
import cx from "classnames"
// import { NotificationSettings } from "../../pages/notification-settings/NotificationSettings"
import styles from "./NotificationsHeader.module.css"
// import Icon from "@/icons"
import ArrowLeft from "@/icons/ArrowLeft"

export const NotificationsHeader = () => {
    const navigate = useNavigate()
    return (
        <div className={cx("s:px-[35px] xs:px-[20px]", styles["notifications-header__container"])}>
            <div className="flex gap-x-[20px] items-center">
                <ArrowLeft onClick={() => navigate(-1)} />
                <h2 className={styles["notifications-header__title"]}>Notificaciones</h2>
            </div>

            {/* <NotificationSettings
                triggerButton={
                    <div aria-label="Configuración">
                        <Icon name="Settings" width={24} height={24} className={styles["notifications-header__icon"]} />
                    </div>
                }
            /> */}
        </div>
    )
}
