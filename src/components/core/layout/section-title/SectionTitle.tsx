import styles from "./SectionTitle.module.css"
import { SectionTitleProps } from "./SectionTitle.type"

const SectionTitle = ({
    title,
    children, 
    semiBold
}: SectionTitleProps) => {
    return (
        <div className={styles["room-status__title__wrapper"]}>
            <span
                className={`xs:text-[18px] s:text-[24px] ${styles["room-status__title"]} ${
                    semiBold ? styles["room-status__title--semibold"] : ""
                }`}
            >
                {title}
            </span>
            {children}
        </div>
    )
}

export default SectionTitle
