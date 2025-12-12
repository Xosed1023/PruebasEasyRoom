import { useEffect, useState } from "react"
import FlexibleTable, { TableFilter } from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Screen from "src/shared/components/layout/screen/Screen"
import "./Fajillas.css"
import RecepcionFajillas from "../../Components/Modals/RecepcionFajillas/RecepcionFajillas"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import FajillaTableColumnStatus from "../../helpers/FajillaTableColumnStatus/FajillaTableColumnStatus"
import { EstatusFajillas, useGetUsuariosQuery } from "src/gql/schema"
//import { EstatusFajillas, useGetUsuariosQuery /*useGetFajillasQuery*/} from "src/gql/schema"
//import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import { useFormatDate } from "src/shared/hooks/useFormatDate"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useProfile } from "src/shared/hooks/useProfile"
import {
    FlexibleTableHeaderColumn,
    FlexibleTableRow,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import useSortTable from "src/shared/hooks/useSortTable"
import { useFajillas } from "./Fajjllas.hooks"

export interface FajillaRow {
    value: {
        value: string | JSX.Element
    }[]
}

const Fajillas = () => {
    const { hotel_id, rolName} = useProfile()
    const { formatCustomDate } = useFormatDate()
    const [addFajilla, setAddFajilla] = useState(false)

    const [fajillaSeleccionada, setFajillaSeleccionada] = useState<any>({})
    const [tableHeaders, setTableHeaders] = useState<FlexibleTableHeaderColumn[]>([])

    const [rowsFajillas, setrowsFajillas] = useState<FlexibleTableRow[]>([])
    const [tableFilters, setTableFilters] = useState<TableFilter[]>([])

    const { skeletonRows } = tableSkeletonRows({ headers: tableHeaders })

    const { data: usuariosListFilter } = useGetUsuariosQuery({
        variables: {
            hotel_id,
        },
    })
    const [load, setLoad] = useState(true)

    useEffect(() => {
        setTableHeaders([
            {
                value: "#",
            },
            {
                value: "Fecha",
                sort: true,
            },
            {
                value: "Monto",
                sort: true,
            },
            {
                value: "Entrega",
                filterMenu: usuariosListFilter?.usuarios.map((c) => ({
                    value: c.usuario_id,
                    valueToDisplay: `${c.nombre} ${c.apellido_paterno}`,
                })),
                isFilterUnique: true,
            },
            {
                value: "Recibe",
                filterMenu: usuariosListFilter?.usuarios.map((c) => ({
                    value: c.usuario_id,
                    valueToDisplay: `${c.nombre} ${c.apellido_paterno}`,
                })),
                isFilterUnique: true,
            },
            {
                value: "Comentarios",
            },
            {
                value: "Estatus",
            },
        ])
    }, [usuariosListFilter])

    const { data: fajillas, refetch, turno: turnoActual } = useFajillas()

    const dataFajillas = (filters?: TableFilter[]) => {
        const array: FlexibleTableRow[] = []
        fajillas?.map((fajilla, index) => {
            array.push({
                value: [
                    { value: String(fajilla.folio) },
                    {
                        value: formatCustomDate(fajilla.fecha_creacion, "DD/MMM/YY hh:mm a"),
                        fromHeaderSort: tableHeaders[1].value,
                        sortValue: fajilla.fecha_creacion,
                    },
                    {
                        value: formatCurrency(fajilla.monto),
                        fromHeaderSort: tableHeaders[2].value,
                        sortValue: fajilla.monto,
                    },
                    {
                        value:
                            fajilla.usuario_creo?.nombre === "Effectitrack"
                                ? `${fajilla.usuario_creo?.nombre} ${fajilla.usuario_creo?.apellido_paterno} - ID${fajilla.deposito_id}` ||
                                  "-"
                                : `${fajilla.usuario_creo?.nombre} ${fajilla.usuario_creo?.apellido_paterno}` || "-",
                        filterValue: fajilla.usuario_creo_id,
                        fromHeaderFilter: tableHeaders[3].value,
                    },
                    {
                        value: fajilla?.usuario_autorizo
                            ? `${fajilla?.usuario_autorizo?.nombre} ${fajilla?.usuario_autorizo?.apellido_paterno}`
                            : "-",
                        filterValue: fajilla?.usuario_autorizo_id || undefined,
                        fromHeaderFilter: tableHeaders[4].value,
                    },
                    { value: fajilla.comentario || "-" },
                    {
                        value: (
                            <FajillaTableColumnStatus
                                status={
                                    !(
                                        rolName === RoleNames.superadmin ||
                                        rolName === RoleNames.admin ||
                                        rolName === RoleNames.gerente
                                    ) && fajilla.estatus === EstatusFajillas.RecibirFajilla
                                        ? "Pendiente"
                                        : fajilla.estatus
                                }
                                onLink={() => {
                                    setAddFajilla(true)
                                    setFajillaSeleccionada(fajilla)
                                }}
                            />
                        ),
                    },
                ],
            })
        })

        let fajillasRows: FlexibleTableRow[] = []
        if (filters?.length) {
            fajillasRows = array.filter((r) =>
                r.value.some((col) =>
                    filters?.some(
                        (filter) => filter.filter === col.filterValue && col.fromHeaderFilter === filter.fromHeader
                    )
                )
            )
        } else {
            fajillasRows = array
        }

        setrowsFajillas(fajillasRows)
        return fajillasRows
    }

    useEffect(() => {
        if (fajillas) {
            dataFajillas()
            setLoad(false)
        }
    }, [fajillas])

    const onFilterTAble = (filters) => {
        dataFajillas(filters)
    }

    const onSortData = (value: { sort: "up" | "down" | null; fromHeader: string; idx: number } | null) => {
        if (!value) {
            return
        }
        setrowsFajillas(
            useSortTable({
                i: value.idx,
                sortedData: rowsFajillas,
                startList: dataFajillas(tableFilters),
                sortState: value.sort,
            })
        )
    }

    return (
        <Screen title={"Retiro de efectivo"} close={true}>
            {!load ? (
                <div className="cortes-subtitle-container">
                    <span className="cortes-subtitle-label">Turno {turnoActual?.nombre}: </span>
                    <span className="cortes-subtitle-value">{formatCustomDate(new Date(), "MMM DD, YYYY")}</span>
                </div>
            ) : (
                <Skeleton elements={1} className="cortes-header-skeleton" />
            )}
            <div className="screen__table animante__select fajillas-table">
                <FlexibleTable
                    onSelectedFilters={(value) => {
                        onFilterTAble(value)
                        setTableFilters(value)
                    }}
                    onSort={(value) => {
                        onSortData(value)
                    }}
                    tableItems={{
                        ...{
                            headers: tableHeaders,
                            rows: load
                                ? skeletonRows
                                : rowsFajillas.map((row) => ({
                                    value: row.value.map(({ value }) => ({
                                        value,
                                    })),
                                })),
                        },
                    }}
                    emptyState={{
                        headerIcon: "dollarCircle",
                        titile: "No se encontraron retiros de efectivo",
                        subTitle: "Sin retiros de efectivo",
                    }}
                ></FlexibleTable>
            </div>
            <RecepcionFajillas
                addFajilla={addFajilla}
                setAddFajilla={setAddFajilla}
                fajilla={fajillaSeleccionada}
                onConfirm={() => refetch()}
            />
        </Screen>
    )
}

export default Fajillas
