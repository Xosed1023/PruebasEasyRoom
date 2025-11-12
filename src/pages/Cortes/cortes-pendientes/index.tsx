import { useMemo, useState } from "react"
import Screen from "src/shared/components/layout/screen/Screen"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Empty from "src/shared/components/data-display/empty/Empty"
import Alerta from "../Components/Modals/PagosPendientes/AlertaSimple"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { CellFolio, CellButtonLink, CellPDFLink } from "./Pendientes.sections"
import { useHeader, useRows } from "./../caratulas/fecha/hooks/useTable"
import { useFetchCortesHistorial } from "./../caratulas/fecha/hooks/useFetch"
import "./../CortesScreen.css"
import "./Pendientes.css"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"
import useSnackbar from "src/shared/hooks/useSnackbar"
import corteDiaOpener from "src/shared/openers/corteDiaOpener"
import { EstatusCorte } from "src/gql/schema"
import { useEfectivo } from "../Sections/ResumenTurno/hooks/useEfectivo"

function CaratulaFecha(): JSX.Element {
    const [corteId, setCorteId] = useState<string>("")

    const { onClearEfectivo } = useEfectivo()
    const [showGradient, setShowGradient] = useState(false);


    const navigate = useNavigate()
    const variables = useMemo(
        () => ({
            fecha_inicio_corte: null,
            estatus: EstatusCorte.Pendiente,
        }),
        []
    )
    const { data = [], load } = useFetchCortesHistorial({ variables, fetch: true })

    const { imas_transaccion_available } = useSelector((state: RootState) => state.hotel)

    const headers = useHeader(data || [])
    const { showSnackbar } = useSnackbar()
    const { rows, handleFilter } = useRows(data)

    useEscapeKey({
        onEscape: () => {
            navigate(-1)
        },
    })

    return (
        <Screen className="cortes-screen-l" title={"Cortes pendientes"} close={true}>
            <div className={`cortes-p__table${showGradient ? " cortes-p__table--show-gradient" : ""}`}>
                {!load ? (
                    data.length > 0 ? (
                        <FlexibleTable
                            onSelectedFilters={handleFilter}
                            onHasScrollChange={setShowGradient}
                            tableItems={{
                                ...{
                                    headers,
                                    rows: rows.map((row) => ({
                                        value: row.value.map(({ value }, index) => ({
                                            value:
                                                index === 0 ? (
                                                    <CellFolio />
                                                ) : index === headers.length - 1 ? (
                                                    <div className="cortes-cell__container">
                                                        <CellPDFLink
                                                            onClick={() => {
                                                                corteDiaOpener({
                                                                    stateNuevoCorteTurno: {
                                                                        corte_id: value || "",
                                                                    },
                                                                })
                                                            }}
                                                        />
                                                        <CellButtonLink
                                                            onClick={() => {
                                                                const corte = data?.find((c) => c?.corte_id === value)

                                                                if (Number(corte?.total_pagos_pendientes || 0) > 0) {
                                                                    setCorteId(value)
                                                                    return
                                                                }
                                                                if (imas_transaccion_available) {
                                                                    onClearEfectivo()
                                                                    return navigate(`/u/cortes/resumen/${value}`)
                                                                }
                                                                showSnackbar({
                                                                    status: "error",
                                                                    title: "Error al cerrar corte",
                                                                    text: "Otro corte se encuentra en proceso de cierre. Por favor, vuelve a intentarlo más tarde.",
                                                                })
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="cortes-p_value">
                                                        {value}
                                                    </div>
                                                ),
                                        })),
                                    })),
                                },
                            }}
                            emptyState={{
                                titile: "Sin resultados",
                                subTitle: "No hay resultados. Intenta de nuevo.",
                                headerIcon: "dollarCircle",
                            }}
                        ></FlexibleTable>
                    ) : (
                        <Empty
                            className="cortes-p__empty"
                            icon="dollarCircle"
                            title={"Sin cortes"}
                            description={"Aquí podrás ver el listado de cortes"}
                        />
                    )
                ) : (
                    <TableSkeleton headers={headers} />
                )}
            </div>
            <Alerta
                visible={!!corteId}
                onClose={() => setCorteId("")}
                onConfirm={() => {
                    onClearEfectivo()
                    navigate(`/u/cortes/resumen/${corteId}`)
                }}
            />
        </Screen>
    )
}

export default CaratulaFecha
