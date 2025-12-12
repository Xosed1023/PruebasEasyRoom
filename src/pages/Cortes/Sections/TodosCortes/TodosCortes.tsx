/* eslint-disable indent */
import React, { useEffect, useState } from "react"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Screen from "src/shared/components/layout/screen/Screen"
import { CortesAdminTable } from "../../cortes.data"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import "./Cortes.css"
import Empty from "src/shared/components/data-display/empty/Empty"
import { useHeader, useRows } from "./getTable"
import { useNavigate } from "react-router-dom"
import { useGetCortesQuery } from "src/gql/schema"
import { Button } from "src/shared/components/forms"
import { CalendarButtons } from "src/pages/reservaciones/inicio/components/CalendarButtons/CalendarButtons"
import { monthNames } from "src/shared/components/forms/datapicker/date-picker"
import { useEfectivo } from "../ResumenTurno/hooks/useEfectivo"

const TodosCortes = () => {
    const navigate = useNavigate()
    const { data, loading: load } = useGetCortesQuery()
    const headers = useHeader(data?.cortes || [])
    const { rows, handleFilter } = useRows(data?.cortes || [])
    const [currMonth, setCurrMonth] = useState(new Date().getMonth())
    const [currYear, setCurrYear] = useState(new Date().getFullYear())
    const [disabledCaratula, setDisabledCaratula] = useState<boolean>(false)
    const { onClearEfectivo } = useEfectivo()

    useEffect(() => {
        if (currMonth > new Date().getMonth() && currYear >= new Date().getFullYear()) setDisabledCaratula(true)
        else if (currYear > new Date().getFullYear()) setDisabledCaratula(true)
        else setDisabledCaratula(false)
    }, [currMonth, currYear])

    return (
        <Screen
            title={"Todos los cortes"}
            close={true}
            headerRight={
                <div className="cortes-screen-header">
                    <CalendarButtons
                        currMonth={currMonth}
                        setCurrMonth={setCurrMonth}
                        currYear={currYear}
                        setCurrYear={setCurrYear}
                        monthNames={monthNames}
                    />
                    <Button
                        text="Carátula mensual"
                        theme="secondary"
                        className="cortes-screen__caratula"
                        onClick={() => window.open(`/pdf/caratula-periodo/${currMonth}/${currYear}`, "_blank")}
                        disabled={disabledCaratula}
                    />
                </div>
            }
        >
            <div className="cortes-subtitle-container">
                <p className="cortes-subtitle-value">Visualiza los turnos cerrados y abiertos </p>
            </div>
            {data && data?.cortes?.length > 0 ? (
                <div className="screen__table animante__select">
                    {!load ? (
                        <FlexibleTable
                            onSelectedFilters={handleFilter}
                            goTo={(path) => {
                                onClearEfectivo()
                                navigate(path)
                            }}
                            tableItems={{
                                ...{
                                    headers: headers,
                                    rows: rows.map((row) => ({
                                        goTo: `/u/cortes/resumen/${row?.goToData}`,
                                        value: row.value.map(({ value }, index, arr) => {
                                            return {
                                                // la ultima columna es la que va a tener este estilo
                                                value:
                                                    index === arr.length - 1 ? (
                                                        <div
                                                            className={
                                                                value === "Cerrado"
                                                                    ? "fajillas-admin-last-column"
                                                                    : "fajillas-admin-last-column-link"
                                                            }
                                                        >
                                                            {value}
                                                        </div>
                                                    ) : // la primera columna
                                                    index === 0 ? (
                                                        <div className="fajillas-admin-first-column">
                                                            {value === "Pendiente" && (
                                                                <span
                                                                    className="ventasDehab_point"
                                                                    style={{ backgroundColor: "#EB5757" }}
                                                                ></span>
                                                            )}
                                                            {value}
                                                        </div>
                                                    ) : (
                                                        value
                                                    ),
                                            }
                                        }),
                                    })),
                                },
                            }}
                        ></FlexibleTable>
                    ) : (
                        <TableSkeleton headers={CortesAdminTable.headers} />
                    )}
                </div>
            ) : (
                <Empty
                    className="cortes-screen__empty"
                    icon="dollarCircle"
                    title={"Sin cortes"}
                    description={
                        "Cuando el hotel comience a operar, podrás consultar en esta sección tus ingresos y egresos"
                    }
                />
            )}
        </Screen>
    )
}

export default TodosCortes
