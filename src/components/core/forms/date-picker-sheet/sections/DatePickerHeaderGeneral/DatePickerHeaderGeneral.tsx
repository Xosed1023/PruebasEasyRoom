import { ReactNode } from "react"

import styles from "./DatePicketHeaderGeneral.module.css"

const DatePickerHeaderGeneral = ({
    headerLeft,
    headerRight,
    handleAccept,
}: {
    headerLeft?: ReactNode
    headerRight?: ReactNode
    handleAccept: () => void
}) => {
    return (
        <div className={styles["datepicker-sheet__header"]}>
            <p className={styles["datepicker-sheet__label"]}>{headerLeft}</p>
            <button className={styles["datepicker-sheet__accept"]} onClick={handleAccept}>
                {headerRight}
            </button>
        </div>
    )
}

export default DatePickerHeaderGeneral
