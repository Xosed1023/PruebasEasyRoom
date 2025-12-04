import Card from "../card/Card"

import styles from "./IncidenceItem.module.css"
import { IncidenceItemProps } from "./IncidenceItem.type"

const IncidenceItem = ({ counter, items, subtitle, title }: IncidenceItemProps) => {
    return (
        <Card className="flex flex-col flex-auto h-[218px] justify-between">
            <span className={styles["incidence-item__title"]}>{title}</span>
            <div className="flex flex-col w-full justify-between items-center">
                <span className={styles["incidence-item__counter"]}>{counter}</span>
                <span className={styles["incidence-item__subtitle"]}>{subtitle}</span>
            </div>
            <div className="flex flex-col">
                {items.map(({ name, value }, i) => (
                    <div className="flex w-full justify-between" key={i}>
                        <span className={styles["incidence-item__label"]}>{name}</span>
                        <span className={styles["incidence-item__value"]}>{value}</span>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default IncidenceItem
