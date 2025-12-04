import styles from "./SalesItem.module.css"
import { SalesItemProps } from "./SalesItem.type"

const SalesItem = ({ items, percentage, title, dotClass }: SalesItemProps) => {
    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-between">
                <div className="flex items-center gap-x-[13px]">
                    <div className={`${styles["sales-item__dot"]} ${dotClass} `}></div>
                    <span>{title}</span>
                </div>
                <span className={styles["sales-item__value"]}>{percentage}%</span>
            </div>
            {items.map(({ name, value }, i) => (
                <div key={i} className="flex justify-between">
                    <span className="ml-[23px]">{name}</span>
                    <span className={styles["sales-item__value"]}>{value}</span>
                </div>
            ))}
        </div>
    )
}

export default SalesItem
