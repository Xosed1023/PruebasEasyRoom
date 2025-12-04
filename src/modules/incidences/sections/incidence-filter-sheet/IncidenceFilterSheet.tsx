import { Drawer, DrawerContent } from "@/components/ui/drawer/Drawer"
import { MONTH_NAMES } from "@/utils/month-names"
import clsx from "clsx"
import styles from "./IncidenceFilterSheet.module.css"
import { Filters, IncidenceFilterSheetProps } from "./IncidenceFilterSheet.type"
import { Button } from "@/components/ui/Button/Button"
import { useState } from "react"
import { getSafeAreaInsetBottom } from "@/helpers/getSafeAreaInsetBottom"

export const IncidenceFilterSheet = ({ selectedFilters, onChange, onClose, open }: IncidenceFilterSheetProps) => {
    const [innerState, setinnerState] = useState<Filters>(selectedFilters)

    const toggle = <K extends keyof Filters>(key: K, value: Filters[K][number]) => {
        const current = innerState[key] as Filters[K][number][]
        const exists = current.includes(value)
        const updated = exists ? current.filter((v) => v !== value) : [...current, value]
        setinnerState((state) => ({ ...state, [key]: updated }))
    }

    const currentMonth = new Date().getMonth()
    const ORIGENES = ["instalaciones", "habitaciones", "huésped"]
    const TURNOS = ["matutino", "vespertino", "nocturno"]
    const URGENCIAS = ["alta", "media", "baja"]

    return (
        <Drawer open={open} onOpenChange={onClose}>
            <DrawerContent className={styles["incidence-filter-sheet"]}>
                <div className={styles["incidence-filter-sheet__header"]}>
                    <h3 className={styles["incidence-filter-sheet__title"]}>Filtros</h3>
                    <button
                        className={styles["incidence-filter-sheet__clear"]}
                        onClick={() => {
                            setinnerState({ months: [currentMonth], origenes: [], turnos: [], urgencias: [] })
                        }}
                    >
                        Borrar filtros
                    </button>
                </div>

                <section>
                    <h4 className={styles["incidence-filter-sheet__subtitle"]}>Fecha</h4>
                    <div className={styles["incidence-filter-sheet__grid"]}>
                        {MONTH_NAMES.map((month, i) => {
                            const isSelected = innerState?.months.includes(i)
                            const isFuture = i > currentMonth
                            return (
                                <button
                                    key={month}
                                    disabled={isFuture}
                                    onClick={() => toggle("months", i)}
                                    className={clsx(
                                        styles["incidence-filter-sheet__button"],
                                        isSelected && styles["incidence-filter-sheet__button--selected"],
                                        isFuture && styles["incidence-filter-sheet__button--disabled"]
                                    )}
                                >
                                    {month}
                                </button>
                            )
                        })}
                    </div>
                </section>

                <section>
                    <h4 className={styles["incidence-filter-sheet__subtitle"]}>Origen de incidencia</h4>
                    <div className={styles["incidence-filter-sheet__grid"]}>
                        {ORIGENES.map((o) => (
                            <button
                                key={o}
                                onClick={() => toggle("origenes", o)}
                                className={clsx(
                                    styles["incidence-filter-sheet__button"],
                                    innerState?.origenes.includes(o) &&
                                        styles["incidence-filter-sheet__button--selected"]
                                )}
                            >
                                {o[0].toUpperCase() + o.slice(1)}
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <h4 className={styles["incidence-filter-sheet__subtitle"]}>Turno</h4>
                    <div className={styles["incidence-filter-sheet__grid"]}>
                        {TURNOS.map((t) => (
                            <button
                                key={t}
                                onClick={() => toggle("turnos", t)}
                                className={clsx(
                                    styles["incidence-filter-sheet__button"],
                                    innerState?.turnos.includes(t) && styles["incidence-filter-sheet__button--selected"]
                                )}
                            >
                                {t[0].toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <h4 className={styles["incidence-filter-sheet__subtitle"]}>Urgencia</h4>
                    <div className={styles["incidence-filter-sheet__grid"]}>
                        {URGENCIAS.map((u) => (
                            <button
                                key={u}
                                onClick={() => toggle("urgencias", u)}
                                className={clsx(
                                    styles["incidence-filter-sheet__button"],
                                    innerState?.urgencias.includes(u) &&
                                        styles["incidence-filter-sheet__button--selected"]
                                )}
                            >
                                {u[0].toUpperCase() + u.slice(1)}
                            </button>
                        ))}
                    </div>
                </section>
                <Button
                    className="mt-[20px]"
                    style={{
                        marginBottom: getSafeAreaInsetBottom(),
                    }}
                    onClick={() => {
                        if (!innerState) {
                            return
                        }
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
