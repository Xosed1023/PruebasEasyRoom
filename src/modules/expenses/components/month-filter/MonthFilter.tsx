import { Drawer, DrawerContent } from "@/components/ui/drawer/Drawer"
import styles from "./MonthFilter.module.css"
import clsx from "clsx"
import { MONTH_NAMES } from "../../../../utils/month-names"
import { Button } from "@/components/ui/Button/Button"
import { useState } from "react"
import { getSafeAreaInsetBottom } from "@/helpers/getSafeAreaInsetBottom"

const currentMonthIndex = new Date().getMonth()

export const MonthFilterSheet = ({
    selectedMonths,
    onChange,
    onClose,
    multiSelect = false,
}: {
    selectedMonths: number[]
    onChange: (months: number[]) => void
    onClose: () => void
    multiSelect?: boolean
}) => {
    const [innerState, setinnerState] = useState<number[]>(selectedMonths)
    const currentMonth = new Date().getMonth()

    const toggleMonth = (monthIndex: number) => {
        if (multiSelect) {
            const exists = innerState.includes(monthIndex)
            const updated = exists ? innerState.filter((m) => m !== monthIndex) : [...innerState, monthIndex]
            setinnerState(updated)
        } else {
            setinnerState([monthIndex])
        }
    }

    return (
        <Drawer open onOpenChange={onClose}>
            <DrawerContent className={styles["month-filter__sheet"]}>
                <div className={styles["month-filter__header"]}>
                    <h3 className={styles["month-filter__title"]}>Filtro</h3>
                    <button
                        className={styles["month-filter__confirm"]}
                        onClick={() => {
                            setinnerState([currentMonth])
                            onChange([currentMonth])
                        }}
                    >
                        Borrar filtro
                    </button>
                </div>

                <div className={styles["month-filter__grid"]}>
                    {MONTH_NAMES?.map((month, index) => {
                        const isSelected = innerState.includes(index)
                        const isFuture = index > currentMonthIndex

                        return (
                            <button
                                key={month}
                                disabled={isFuture}
                                onClick={() => toggleMonth(index)}
                                className={clsx(
                                    styles["month-filter__button"],
                                    isSelected && styles["month-filter__button--selected"],
                                    isFuture && styles["month-filter__button--disabled"]
                                )}
                            >
                                {month}
                            </button>
                        )
                    })}
                </div>
                <Button
                    style={{
                        marginBottom: getSafeAreaInsetBottom(),
                    }}
                    className="mt-[20px]"
                    onClick={() => {
                        onChange(innerState)
                        onClose()
                    }}
                >
                    Aceptar
                </Button>
            </DrawerContent>
        </Drawer>
    )
}
