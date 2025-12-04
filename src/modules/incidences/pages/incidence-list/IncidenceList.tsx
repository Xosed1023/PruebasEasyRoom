import styles from "./IncidenceList.module.css"
import Icon from "@/icons"
import { Props } from "./IncidenceList.type"
import { useNavigate } from "react-router"
import { useProfile } from "@/hooks/store/useProfile"

const IncidenceList = ({ incidences, onClickItem }: Props) => {
    const navigate = useNavigate()
    const { hotel_id } = useProfile()

    return (
        <div className={`${styles["incidence-list__container"]}`}>
            {incidences.map((item) => (
                <div
                    key={item.id}
                    onClick={() => onClickItem?.(item)}
                    className={`${styles["incidence-list__item"]} ${
                        item.unread ? styles["incidence-list__item--highlight"] : ""
                    }`}
                >
                    <div className={styles["incidence-list__icon-wrapper"]} style={{ backgroundColor: item.bgColor }}>
                        <Icon name={item.icon} width={16} height={16} color={item.iconColor} />
                    </div>

                    <div className={styles["incidence-list__content"]}>
                        <p
                            className={`${styles["incidence-list__category"]} ${
                                item.unread ? styles["incidence-list__category--bold"] : ""
                            }`}
                        >
                            {item.category}
                        </p>
                        <p
                            className={`${styles["incidence-list__description"]} ${
                                item.unread ? styles["incidence-list__description--bold"] : ""
                            }`}
                        >
                            {item.description}
                        </p>
                    </div>

                    <div className={styles["incidence-list__meta"]}>
                        <span className={styles["incidence-list__date"]}>{item.date}</span>
                        {item.unread && <span className={styles["incidence-list__dot"]} />}
                    </div>
                </div>
            ))}
            <button
                className={styles["incidence-list__add-button"]}
                aria-label="Agregar nueva incidencia"
                onClick={() => navigate(`/u/incidences/${hotel_id}/new`)}
            >
                <Icon name="Plus" width={24} height={24} color="white" />
            </button>
        </div>
    )
}

export default IncidenceList
