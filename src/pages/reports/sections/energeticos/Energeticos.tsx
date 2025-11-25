import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react"
import { useFetch } from "src/shared/hooks/useFetch"
import { useProfile } from "src/shared/hooks/useProfile"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import {
    FlexibleTableHeaderColumn,
    FlexibleTableRow,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import TableWrappper from "src/pages/reservaciones/inicio/sections/TableWrapper/TableWrapper"
import FlexibleTable, {
    SortFilterValue,
    TableFilter,
} from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { EnergeticosItems, TablaMantto } from "./Energeticos.type"
import ReportWrapper from "../../components/report-wrapper/ReportWrapper"
import CardReports from "../../components/card-reports/CardReports"
import CardReport from "../../components/card-report/CardReport"
import SkeletonCards from "src/pages/gastos/components/gastos-list/SkeletonCard/SkeletonCard"
import FloatButon from "src/shared/components/layout/FloatButon/FloatButon"
import { Stringify } from "src/shared/types/Stringify"
import useDownloadPdf from "src/shared/hooks/useDownloadPdf"
import useColaboradoresHeader from "../hooks/useColaboradoresHeader"
import useTurnoHeader from "../hooks/useTurnoHeader"
import useFormattedMeta from "../hooks/useFormattedMeta"
import formatLongNumber from "src/shared/helpers/formatLongNumber"
import Icon from "src/shared/icons"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { EnergeticoData } from "src/pages/mantenimiento/sections/Table/Table"
import RegistroEnergeticos from "src/pages/mantenimiento/sections/RegistroEnergeticos/RegistroEnergeticos"
import EditEnergeticos from "src/pages/mantenimiento/sections/EditEnergeticos/EditEnergeticos"

export interface EnergeticosRef {
    onAddEnergetico: () => void
}

const Energeticos = (
    { apiDateFilter }: { apiDateFilter: string[] | null },
    ref: ForwardedRef<EnergeticosRef | null>
) => {
    const { hotel_id } = useProfile()
    const { download } = useDownloadPdf()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const [isRegistroModalOpen, setisRegistroModalOpen] = useState(false)
    const [isEditModalOpen, setisEditModalOpen] = useState(false)
    const [editEnergeticoData, setEditData] = useState<EnergeticoData>()

    const onEditEnergetico = validateIsColabActive((v: EnergeticoData) => {
        setEditData(v)
        setisEditModalOpen(true)
    })

    const onAddEnergetico = validateIsColabActive((v: EnergeticoData) => {
        setEditData(v)
        setisRegistroModalOpen(true)
    })
    useImperativeHandle(ref, () => ({ onAddEnergetico }))

    const { data, refetch, load } = useFetch<EnergeticosItems>("/reportes/tabla_historial_energeticos", {
        startFetch: false,
    })

    const responsableHeader = useColaboradoresHeader<Stringify<TablaMantto>>({
        headerValue: "reponsable",
        valueToDisplay: "Responsable",
    })

    const turnoHeader = useTurnoHeader<Stringify<TablaMantto>>({
        headerValue: "turno",
        valueToDisplay: "Turno",
    })

    const [currentPage, setcurrentPage] = useState(1)

    const [sortValue, setsortValue] = useState<SortFilterValue | null>(null)
    const [filterValues, setfilterValues] = useState<TableFilter[] | null>(null)

    const formattedMetaValues = useMemo<{
        filterValues: TableFilter[] | null
        sortValue: SortFilterValue | null
        headerValues: Stringify<TablaMantto>[]
    }>(
        () => ({
            filterValues,
            sortValue,
            headerValues: ["fecha_registro", "reponsable", "turno"],
        }),
        [filterValues, sortValue]
    )

    const { formattedMeta } = useFormattedMeta(formattedMetaValues)

    useEffect(() => {
        if (apiDateFilter) {
            refetch({
                hotel_id,
                fecha_inicio: apiDateFilter[0],
                fecha_fin: apiDateFilter[1],
                take: 15,
                page: currentPage,
                ...(formattedMeta?.filtro ? { filtro: JSON.stringify(formattedMeta.filtro) } : {}),
                ...(formattedMeta?.orden ? { orden: JSON.stringify(formattedMeta.orden) } : {}),
            })
        }
    }, [apiDateFilter, currentPage, formattedMeta])

    const headers: FlexibleTableHeaderColumn[] = [
        { value: "No. Corte" },
        { value: "fecha_registro", valueToDisplay: "Fecha y hora", sort: true },
        turnoHeader,
        { value: "Agua" },
        { value: "Gas" },
        { value: "Luz" },
        responsableHeader,
        { value: "Acciones" },
    ]

    const { skeletonRows } = tableSkeletonRows({ headers })

    const tableItems: FlexibleTableRow[] = data?.respuesta.tabla_mantto?.map((energetico, index) => ({
        value: [
            { value: energetico.no_corte || "-", className: "reports-cell" },
            { value: energetico.fecha_registro || "-", className: "reports-cell" },
            { value: energetico.turno || "-", className: "reports-cell" },
            { value: energetico.agua || "-", className: "reports-cell" },
            { value: energetico.gas || "-", className: "reports-cell" },
            { value: energetico.luz || "-", className: "reports-cell" },
            { value: energetico.reponsable, className: "reports-cell" },
            {
                value: (
                    <Icon
                        name="pencil"
                        width={16}
                        height={16}
                        color="var(--primary)"
                        onClick={() =>
                            onEditEnergetico({
                                agua: energetico.agua,
                                gas: energetico.gas,
                                luz: energetico.luz,  
                                responsable: {
                                    id: energetico.colaborador_id,
                                    name: energetico.reponsable,
                                },
                                mantenimiento_id: energetico.mantenimiento_id,
                            })
                        }
                    />
                ),
            },
        ],
        key: index + "",
    }))

    return (
        <ReportWrapper height="calc(100dvh - 125px)">
            {load ? (
                <SkeletonCards />
            ) : (
                <CardReports>
                    <CardReport
                        title="Consumo de agua"
                        value={formatLongNumber(data?.dashboard?.consumo_agua || 0) + "L"}
                    />
                    <CardReport
                        title="Consumo de gas"
                        value={formatLongNumber(data?.dashboard?.consumo_gas || 0) + "m³"}
                    />
                    <CardReport
                        title="Consumo de luz"
                        value={formatLongNumber(data?.dashboard?.consumo_luz || 0) + "kW"}
                    />
                </CardReports>
            )}
            <TablePaginatorWrapper
                className="historial-propinas__table__wrapper"
                currentPage={currentPage}
                onChange={(p) => setcurrentPage(p)}
                pages={data?.respuesta.total_paginas || 0}
                style={{
                    justifyContent: data?.respuesta?.tabla_mantto?.length ? "flex-start" : "center",
                    borderRadius: "0 0 20px 0",
                }}
            >
                <TableWrappper>
                    <FlexibleTable
                        emptyState={{
                            headerIcon: "PieChartFilled",
                            titile: "Aún no hay reportes disponibles",
                            subTitle:
                                "Todavía no hay datos para mostrar en esta sección. Una vez que se genere un reporte, lo verás aquí.",
                        }}
                        onSelectedFilters={setfilterValues}
                        onSort={setsortValue}
                        containterClassName="historial-propinas__table"
                        tableItems={{
                            headers,
                            rows: load ? skeletonRows : tableItems,
                        }}
                    />
                </TableWrappper>
                <FloatButon
                    icon="Download"
                    onAdd={() => {
                        if (!apiDateFilter?.length) {
                            return
                        }
                        download({
                            endpoint: "/reportes/tabla_historial_energeticos",
                            params: {
                                hotel_id,
                                fecha_inicio: apiDateFilter[0],
                                fecha_fin: apiDateFilter[1],
                                descargar: true,
                            },
                            title: "historial_energeticos",
                        })
                    }}
                />
            </TablePaginatorWrapper>
            {isRegistroModalOpen && (
                <RegistroEnergeticos
                    isOpen={isRegistroModalOpen}
                    onClose={() => setisRegistroModalOpen(false)}
                    onSuccess={() => {
                        refetch({
                            hotel_id,
                            fecha_inicio: apiDateFilter?.[0],
                            fecha_fin: apiDateFilter?.[1],
                            take: 15,
                            page: currentPage,
                            ...(formattedMeta?.filtro ? { filtro: JSON.stringify(formattedMeta.filtro) } : {}),
                            ...(formattedMeta?.orden ? { orden: JSON.stringify(formattedMeta.orden) } : {}),
                        })
                    }}
                />
            )}
            {isEditModalOpen && (
                <EditEnergeticos
                    startValue={editEnergeticoData}
                    isOpen={isEditModalOpen}
                    onClose={() => setisEditModalOpen(false)}
                    onSuccess={() => {
                        refetch({
                            hotel_id,
                            fecha_inicio: apiDateFilter?.[0],
                            fecha_fin: apiDateFilter?.[1],
                            take: 15,
                            page: currentPage,
                            ...(formattedMeta?.filtro ? { filtro: JSON.stringify(formattedMeta.filtro) } : {}),
                            ...(formattedMeta?.orden ? { orden: JSON.stringify(formattedMeta.orden) } : {}),
                        })
                    }}
                />
            )}
            {InactiveModal}
        </ReportWrapper>
    )
}

export default forwardRef(Energeticos)
