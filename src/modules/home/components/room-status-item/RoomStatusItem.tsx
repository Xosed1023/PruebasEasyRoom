import IconBorder from "@/components/core/general/icon-border/IconBorder"
import styles from "./RoomStatusItem.module.css"
import { RoomStatusItemProps } from "./RoomStatusItem.type"
import RoomStatusValueSkeleton from "../Room-status-value-skeleton/RoomStatusValueSkeleton"

const RoomStatusItem = ({ title, value, icon, iconColor, loading }: RoomStatusItemProps) => {
    return (
        <div className={styles["room-status-item"]}>
            <div className={styles["room-status-item_status"]}>
                <IconBorder primaryBgColor={iconColor} primaryBgDiameter={24}>
                    {icon}
                </IconBorder>
                <span className={styles["room-status-item_label"]}>{title}</span>
            </div>
            {loading ? (
                <RoomStatusValueSkeleton />
            ) : (
                <span className={styles["room-status-item__value"]}>{value}</span>
            )}
        </div>
    )
}

export default RoomStatusItem
