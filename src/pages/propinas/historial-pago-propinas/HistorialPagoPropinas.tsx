import React, { useEffect, useMemo, useState } from "react"

import "./HistorialPagoPropinas.css"
import Screen from "src/shared/components/layout/screen/Screen"
import { InputText } from "src/shared/components/forms"
import SerachLg from "src/shared/icons/SearchLg"
import CalendarPaginator from "src/shared/components/navigation/CalendarPaginator/CalendarPaginator"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import {
    Pagos_PropinasQuery,
    useGetAreasQuery,
    useGetPuestosByHotelIdQuery,
    usePagos_PropinasLazyQuery,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import useLoadingState from "src/shared/hooks/useLoadingState"
import { useDate } from "src/shared/hooks/useDate"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import useTableHeaders from "./hooks/useTableHeaders"
import { formatLongDate } from "src/shared/helpers/formatLongDate"
import { useFetch } from "src/shared/hooks/useFetch"
import Card from "src/shared/components/data-display/card/Card"
import { getCurrencyFormat } from "src/utils/string"
import SkeletonCards from "src/pages/gastos/components/gastos-list/SkeletonCard/SkeletonCard"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"

const HistorialPagoPropinas = () => {
    const { hotel_id } = useProfile()
    const { UTCStringToLocalDate } = useDate()

    const [filterDate, setFilterDate] = useState(new Date())

    const { data: areas } = useGetAreasQuery({
        variables: {
            hotel_id,
        },
    })

    const [getHistorialPagosPropina] = usePagos_PropinasLazyQuery()

    const [pagosPropinas, setpagosPropinas] = useState<Pagos_PropinasQuery["pagos_propinas"]>([])

    const { isLoading, toggleIsLoading } = useLoadingState()

    const [searchNameTextValue, setSearchNameTextValue] = useState("")

    const [filters, setFilters] = useState<{ area: string[]; puesto: string[] }>()

    const { data: puestos } = useGetPuestosByHotelIdQuery()

    const headers = useTableHeaders({ areas, puestos })
    const [page, setPage] = useState(1)
    const rowsPerPage = 10
    const [showBottomGradient, setShowBottomGradient] = useState(false)

    const filteredRows = useMemo(() => {
        return pagosPropinas
            .filter((pp) => (filters?.area?.length ? filters.area.includes(pp.personal?.area?.nombre || "") : true))
            .filter((pp) =>
                filters?.puesto?.length ? filters.puesto.includes(pp.personal?.puesto?.nombre || "") : true
            )
            .filter((pp) =>
                `${pp.personal?.nombre} ${pp.personal?.apellido_paterno} ${pp.personal?.apellido_materno}`
                    .toLowerCase()
                    .includes(searchNameTextValue.trim().toLowerCase())
            )
            .map((pp) => ({
                value: [
                    { value: pp.folio },
                    {
                        value: formatLongDate(UTCStringToLocalDate(pp.fecha_registro), true, false),
                    },
                    { value: pp.periodo_pago },
                    {
                        value: `${pp.personal?.nombre} ${pp.personal?.apellido_paterno} ${pp.personal?.apellido_materno}`,
                    },
                    { value: pp.personal?.area?.nombre },
                    { value: pp.personal?.puesto?.nombre },
                    {
                        value: getCurrencyFormat(
                            Math.floor(Number(pp?.asignacion_propina?.monto_pagado || 0) * 100) / 100
                        ),
                    },
                ],
            }))
    }, [pagosPropinas, filters, searchNameTextValue])

    const paginatedRows = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage
        const endIndex = startIndex + rowsPerPage
        return filteredRows.slice(startIndex, endIndex)
    }, [filteredRows, page])

    useEffect(() => {
        toggleIsLoading({ value: true })
        getHistorialPagosPropina({
            variables: {
                hotel_id,
                pago_propinas_input: {
                    mes_y_anio: `${(filterDate.getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}-${filterDate.getFullYear()}`,
                },
            },
        })
            .then((pp) => {
                setpagosPropinas(pp.data?.pagos_propinas || [])
            })
            .finally(() => {
                toggleIsLoading({ value: false })
            })
    }, [filterDate])

    const {
        data: cardsData,
        load,
        refetch: refetchCards,
    } = useFetch("/cortes/historial-propinas-cards", {
        variables: {
            anio: filterDate.getFullYear(),
            mes: filterDate.getMonth() + 1,
            hotel_id: hotel_id,
        },
        startFetch: true,
    })

    useEffect(() => {
        refetchCards({
            anio: filterDate.getFullYear(),
            mes: filterDate.getMonth() + 1,
            hotel_id: hotel_id,
        })
    }, [filterDate])

    const dataCards = useMemo(() => {
        return [
            {
                title: "Total propinas pagadas",
                number: getCurrencyFormat(cardsData?.total_propinas_pagadas?.[0]?.total_popinas_pagadas || 0),
            },
            {
                title: "Saldo de propinas",
                number: getCurrencyFormat(cardsData?.saldo_propinas?.[0]?.saldo_propinas || 0),
            },
            {
                title: "Propinas pendientes de pago",
                number: getCurrencyFormat(cardsData?.propinas_pdtes_pago?.[0]?.propinas_pendientes_pago || 0),
            },
            {
                title: "Total comisiones bancarias",
                number: getCurrencyFormat(cardsData?.total_comisiones_bancarias?.[0]?.comisiones_bancarias || 0),
            },
            {
                title: "Último pago",
                number: getCurrencyFormat(cardsData?.ultimo_pago_propina?.[0]?.ultimo_pago || 0),
            },
        ]
    }, [cardsData])

    return (
        <Screen
            className="historial-pago-propinas__layout"
            title="Historial de pago de propinas"
            back
            close
            headerRight={
                <div className="historial-pago-propinas__header__right">
                    <InputText
                        inputWrapperClass="historial-pago-propinas__search"
                        type="text"
                        placeholder="Busca por nombre de colaborador"
                        icon={SerachLg}
                        iconProps={{ color: "var(--primary)" }}
                        value={searchNameTextValue}
                        onChange={(e) => {
                            setSearchNameTextValue(e.target.value)
                            setPage(1)
                        }}
                    />
                    <CalendarPaginator mode="month" onChange={(v) => setFilterDate(v)} value={filterDate} />
                    <CalendarPaginator mode="year" value={filterDate} onChange={(v) => setFilterDate(v)} />
                </div>
            }
        >
            <TablePaginatorWrapper
                currentPage={page}
                onChange={(p) => setPage(p)}
                pages={Math.ceil(filteredRows.length / rowsPerPage) || 1}
            >
                <div className="historial-pago-propinas__table__wrapper">
                    {isLoading || load ? (
                        <>
                            <SkeletonCards />
                            <TableSkeleton headers={headers} />
                        </>
                    ) : (
                        <>
                            <div className="historial-pago-propinas__cards">
                                {dataCards.map((card, index) => (
                                    <Card
                                        key={index}
                                        percent={""}
                                        className="historial-pago-propinas__card"
                                        title={card.title}
                                        number={card.number}
                                    />
                                ))}
                            </div>
                            <div
                                className={`historial-pago-propinas__table-scroll${
                                    showBottomGradient ? " historial-pago-propinas__table-scroll--show-gradient" : ""
                                }`}
                            >
                                <FlexibleTable
                                    onSelectedFilters={(tableFilters) => {
                                        setPage(1)
                                        setFilters({
                                            area: tableFilters
                                                .filter((filter) => filter.fromHeader === "Área")
                                                .map((f) => f.filter),
                                            puesto: tableFilters
                                                .filter((filter) => filter.fromHeader === "Puesto")
                                                .map((f) => f.filter),
                                        })
                                    }}
                                    tableItems={{
                                        headers: headers,
                                        rows: paginatedRows,
                                    }}
                                    emptyState={{
                                        headerIcon: "handCoin",
                                        titile: "No se encontraron propinas pagadas",
                                    }}
                                    onHasScrollChange={setShowBottomGradient}
                                />
                            </div>
                        </>
                    )}
                </div>
            </TablePaginatorWrapper>
        </Screen>
    )
}

export default HistorialPagoPropinas
