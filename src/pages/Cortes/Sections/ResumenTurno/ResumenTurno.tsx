import Screen from "src/shared/components/layout/screen/Screen"
import "./Resumen.css"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import {
    IngresosItems,
    FajillasItems,
    GastosItems,
    IncidenciasItems,
    RoomReservasItems,
    PropinasItems,
} from "./resumen.data"
import ResumenTicket from "../../Components/ResumenTicket/ResumenTicket"
import { useNavigate, useParams } from "react-router-dom"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { getDateStringMDY } from "src/utils/date"
import { useProfile } from "src/shared/hooks/useProfile"
import { useRows } from "./hooks/useTableData"
import { useFetch } from "../../../../shared/hooks/useFetch"
import { useEffect, useState } from "react"
import { useResumenParams } from "./hooks/useResumenParams"
import Efectivo from "../../Components/Modals/Efectivo/Efectivo"
import { Button } from "src/shared/components/forms"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import { ResumenCorteTickets } from "./interfaces/resumenCorteTickets"
import { ResumenPagos } from "./interfaces/resumenPagos"

function ResumenTurno(): JSX.Element {
    const { corte_id = "" } = useParams()
    const navigate = useNavigate()
    const { hotel_id } = useProfile()

    const [visible, setVisible] = useState(false)

    const { turno_id, fecha_inicio, fecha_fin, date, usuario_id, fecha_cierre, nombre, loading, estatus } =
        useResumenParams(corte_id)
    const {
        data: resumen,
        load,
        refetch: refetchResumen,
    } = useFetch<ResumenCorteTickets>("/cortes/resumen_corte_tickets", {
        startFetch: false,
    })

    const { data: dashboard, refetch: refetchDashboard } = useFetch<ResumenPagos>("/cortes/resumen_pagos", {
        startFetch: false,
    })

    useEffect(() => {
        if (turno_id && !loading) {
            const fechas = {
                fecha_inicio,
                fecha_fin,
            }
            const variables = {
                usuario_id,
                turno_id,
                hotel_id,
                ...(fecha_inicio ? { ...fechas } : {}),
            }
            refetchResumen(variables)
            refetchDashboard(variables)
        }
    }, [turno_id, fecha_inicio, loading])

    const {
        rowsEstancia,
        rowsRoomService,
        rowsRestaurante,
        rowsReservas,
        rowsEfectivo,
        rowsGastos,
        rowsIncidencias,
        rowsCancelaciones,
        rowsPropinas,
        rowsAnticiposValidos,
    } = useRows(resumen, dashboard)

    useEscapeKey({
        onEscape: () => {
            if (visible) {
                return setVisible(false)
            }
            navigate(-1)
        },
    })

    return (
        <Screen
            title={"Detalle del corte"}
            className="resumen-turno__container"
            contentClassName="resumen-turno__screen"
            close={true}
            onClose={() => navigate("/u/cortes")}
            back={fecha_cierre ? true : false}
            headerRight={
                !fecha_cierre &&
                !load && (
                    <Button
                        text={"Ingresar efectivo"}
                        theme="secondary"
                        className="ingresar-efectivo__button"
                        onClick={() => setVisible(true)}
                    />
                )
            }
        >
            {!load ? (
                <div className="">
                    <span className="resumen-turno__turno">Turno {nombre?.toLowerCase() || "matutino"}: </span>
                    <span className="resumen-turno__fecha">{getDateStringMDY(date)}</span>
                </div>
            ) : (
                <Skeleton elements={1} className="cortes-header-skeleton" />
            )}
            <div className="resumen-turno__info">
                <div className="resumen-turno__tables scrollbar__light-fat">
                    <div className="resumen-turno__container__title">
                        <p className="resumen-turno__subtitle">Estancia</p>
                        {corte_id && (
                            <p
                                className="resumen-turno__subtitle-link"
                                onClick={() =>
                                    navigate("/u/cortes/resumen/movimientos", {
                                        state: {
                                            fecha_fin,
                                            fecha_inicio,
                                            turno_id,
                                            turno: nombre,
                                            usuario_id,
                                            corte_pendiente: estatus === "pendiente",
                                        },
                                    })
                                }
                            >
                                {"Ver saldos y movimientos"}
                            </p>
                        )}
                    </div>
                    <div className={rowsEstancia.length > 0 ? "resumen-turno__table-ingresos" : ""}>
                        {!load ? (
                            rowsEstancia.length > 0 ? (
                                <FlexibleTable
                                    tableItems={{
                                        ...{
                                            headers: IngresosItems.header,
                                            rows: rowsEstancia.map((row) => ({
                                                value: row.value.map(({ value }) => ({
                                                    value: value,
                                                })),
                                                className: row.className,
                                            })),
                                        },
                                    }}
                                />
                            ) : (
                                <div className="resumen-truno__empty-table">Sin movimientos en turno</div>
                            )
                        ) : (
                            <TableSkeleton headers={IngresosItems.header} />
                        )}
                    </div>

                    <p className="resumen-turno__subtitle">Anticipos válidos</p>
                    <div className={rowsAnticiposValidos.length > 0 ? "resumen-turno__table-ingresos" : ""}>
                        {!load ? (
                            rowsAnticiposValidos.length > 0 ? (
                                <FlexibleTable
                                    tableItems={{
                                        ...{
                                            headers: IngresosItems.header,
                                            rows: rowsAnticiposValidos.map((row) => ({
                                                value: row.value.map(({ value }) => ({
                                                    value: value,
                                                })),
                                                className: row.className,
                                            })),
                                        },
                                    }}
                                />
                            ) : (
                                <div className="resumen-truno__empty-table">Sin anticipos válidos en turno</div>
                            )
                        ) : (
                            <TableSkeleton headers={FajillasItems.header} />
                        )}
                    </div>
                    <p className="resumen-turno__subtitle">Room service</p>
                    <div className={rowsRoomService.length > 0 ? "resumen-turno__table-room-service" : ""}>
                        {!load ? (
                            rowsRoomService.length > 0 ? (
                                <FlexibleTable
                                    tableItems={{
                                        ...{
                                            headers: RoomReservasItems.header,
                                            rows: rowsRoomService.map((row) => ({
                                                value: row.value.map(({ value }) => ({
                                                    value: value,
                                                })),
                                                className: row.className,
                                            })),
                                        },
                                    }}
                                />
                            ) : (
                                <div className="resumen-truno__empty-table">Sin room service en turno</div>
                            )
                        ) : (
                            <TableSkeleton headers={FajillasItems.header} />
                        )}
                    </div>
                    <div>
                        <p className="resumen-turno__subtitle">Restaurante</p>
                        <div className={rowsRestaurante.length > 0 ? "resumen-turno__table-room-service" : ""}>
                            {!load ? (
                                rowsRestaurante.length > 0 ? (
                                    <FlexibleTable
                                        tableItems={{
                                            ...{
                                                headers: RoomReservasItems.header,
                                                rows: rowsRestaurante.map((row) => ({
                                                    value: row.value.map(({ value }) => ({
                                                        value: value,
                                                    })),
                                                    className: row.className,
                                                })),
                                            },
                                        }}
                                    />
                                ) : (
                                    <div className="resumen-truno__empty-table">Sin restaurante en turno</div>
                                )
                            ) : (
                                <TableSkeleton headers={FajillasItems.header} />
                            )}
                        </div>
                    </div>
                    <p className="resumen-turno__subtitle">Reservaciones</p>
                    <div className={rowsReservas.length > 0 ? "resumen-turno__table-reservas" : ""}>
                        {!load ? (
                            rowsReservas.length > 0 ? (
                                <FlexibleTable
                                    tableItems={{
                                        ...{
                                            headers: RoomReservasItems.header,
                                            rows: rowsReservas.map((row) => ({
                                                value: row.value.map(({ value }) => ({
                                                    value: value,
                                                })),
                                                className: row.className,
                                            })),
                                        },
                                    }}
                                />
                            ) : (
                                <div className="resumen-truno__empty-table">Sin reservas en turno</div>
                            )
                        ) : (
                            <TableSkeleton headers={FajillasItems.header} />
                        )}
                    </div>
                    <p className="resumen-turno__subtitle">Manejo de efectivo</p>
                    <div className="resumen-turno__table-efectivo">
                        {!load ? (
                            <FlexibleTable
                                tableItems={{
                                    ...{
                                        headers: FajillasItems.header,
                                        rows: rowsEfectivo.map((row) => ({
                                            value: row.value.map(({ value }) => ({
                                                value: value,
                                            })),
                                            className: row.className,
                                        })),
                                    },
                                }}
                            />
                        ) : (
                            <TableSkeleton headers={FajillasItems.header} />
                        )}
                    </div>
                    <p className="resumen-turno__subtitle">Propinas</p>
                    <div className={rowsPropinas?.length > 0 ? "resumen-turno__table-propinas" : ""}>
                        {!load ? (
                            rowsPropinas?.length > 0 ? (
                                <FlexibleTable
                                    tableItems={{
                                        ...{
                                            headers: PropinasItems.header,
                                            rows: rowsPropinas?.map((row) => ({
                                                value: row.value.map(({ value }) => ({
                                                    value: value,
                                                })),
                                                className: row.className,
                                            })),
                                        },
                                    }}
                                />
                            ) : (
                                <div className="resumen-truno__empty-table">Sin propinas en turno</div>
                            )
                        ) : (
                            <TableSkeleton headers={GastosItems.header} />
                        )}
                    </div>
                    <p className="resumen-turno__subtitle">Cancelaciones</p>
                    <div className="resumen-turno__table-room-service">
                        {!load ? (
                            rowsCancelaciones.length > 0 ? (
                                <FlexibleTable
                                    tableItems={{
                                        ...{
                                            headers: RoomReservasItems.header,
                                            rows: rowsCancelaciones.map((row) => ({
                                                value: row.value.map(({ value }) => ({
                                                    value: value,
                                                })),
                                                className: row.className,
                                            })),
                                        },
                                    }}
                                />
                            ) : (
                                <div className="resumen-truno__empty-table">Sin cancelaciones en turno</div>
                            )
                        ) : (
                            <TableSkeleton headers={FajillasItems.header} />
                        )}
                    </div>
                    <p className="resumen-turno__subtitle">Gastos</p>
                    <div className={rowsGastos.length > 0 ? "resumen-turno__table-gastos" : ""}>
                        {!load ? (
                            rowsGastos.length > 0 ? (
                                <FlexibleTable
                                    tableItems={{
                                        ...{
                                            headers: GastosItems.header,
                                            rows: rowsGastos.map((row) => ({
                                                value: row.value.map(({ value }) => ({
                                                    value: value,
                                                })),
                                                className: row.className,
                                            })),
                                        },
                                    }}
                                />
                            ) : (
                                <div className="resumen-truno__empty-table">Sin gastos en turno</div>
                            )
                        ) : (
                            <TableSkeleton headers={GastosItems.header} />
                        )}
                    </div>
                    <p className="resumen-turno__subtitle">Incidencias</p>
                    <div
                        className={rowsIncidencias.length > 0 ? "resumen-turno__table-incidencias" : ""}
                        style={{ marginBottom: 20 }}
                    >
                        {!load ? (
                            rowsIncidencias.length > 0 ? (
                                <FlexibleTable
                                    tableItems={{
                                        ...{
                                            headers: IncidenciasItems.header,
                                            rows: rowsIncidencias.map((row) => ({
                                                value: row.value.map(({ value }) => ({
                                                    value: value,
                                                })),
                                            })),
                                        },
                                    }}
                                />
                            ) : (
                                <div className="resumen-truno__empty-table">Sin incidencias en turno</div>
                            )
                        ) : (
                            <TableSkeleton headers={IncidenciasItems.header} />
                        )}
                    </div>
                </div>
                <ResumenTicket
                    fecha_cierre={fecha_cierre}
                    fecha_fin={fecha_fin}
                    fecha_inicio={fecha_inicio}
                    turno_id={turno_id}
                    corte_id={corte_id}
                    loading={loading}
                />
                <Efectivo visible={visible} setVisible={setVisible} />
            </div>
        </Screen>
    )
}

export default ResumenTurno
