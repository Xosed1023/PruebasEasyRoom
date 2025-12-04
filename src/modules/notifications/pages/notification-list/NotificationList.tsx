import styles from "./NotificationList.module.css"
import Icon from "@/icons"
import { Props } from "./Notification.type"

export const NotificationList = ({ items, onClickItem }: Props) => {
    return (
        <div className={styles["notification-list__container"]}>
            {items.map((item) => (
                <div
                    key={item.id}
                    onClick={() => onClickItem?.(item)}
                    className={`${styles["notification-list__item"]} s:px-[35px] xs:px-[20px] ${
                        item.unread ? styles["notification-list__item--unread"] : ""
                    }`}
                >
                    <div
                        className={styles["notification-list__icon-wrapper"]}
                        style={{ backgroundColor: item.bgColor }}
                    >
                        <Icon name={item.icon} width={16} height={16} color={item.iconColor} />
                    </div>

                    <div className={styles["notification-list__content"]}>
                        <p
                            className={`${styles["notification-list__title"]} ${
                                item.unread ? styles["notification-list__description--bold"] : ""
                            }`}
                        >
                            {item.title}
                        </p>
                        <p
                            className={`${styles["notification-list__description"]} ${
                                item.unread ? styles["notification-list__description--bold"] : ""
                            }`}
                        >
                            {item.description}
                        </p>
                    </div>

                    <div className={styles["notification-list__meta"]}>
                        <span className={styles["notification-list__date"]}>{item.date}</span>
                        {item.unread && <span className={styles["notification-list__dot"]} />}
                    </div>
                </div>
            ))}
        </div>
    )
}
