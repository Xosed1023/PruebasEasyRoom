import Screen from "src/shared/components/layout/screen/Screen"
import ProductividadCamaristas from "./sections/productividad-camaristas/ProductividadCamaristas"
import { useState } from "react"
import DateFilter from "./components/date-filter/DateFilter"
import { useDate } from "src/shared/hooks/useDate"
import FormatUTCDateToApiDate from "../Cortes/EjmPDF/sections/helpers/FormatUTCDateToApiDate"
import { ReportsOptions, ReportsSections, ReportsSubSections } from "./Reports.type"
import ArticulosVendidos from "./sections/articulos-vendidos/ArticulosVendidos"
import Huespedes from "./sections/huespedes/Huespedes"
import Incidencias from "./sections/incidencias/Incidencias"
import HistorialMantenimientos from "./sections/mantenimientos/Mantenimientos"
import Habitaciones from "./sections/habitaciones/Habitaciones"
import Inventarios from "./sections/inventarios/Inventarios"
import Propinas from "./sections/propinas/Propinas"
import FloatingMenu from "src/shared/components/data-display/floating-menu/FloatingMenu"
import { ButtonIcon } from "src/shared/components/forms/button-icon/ButtonIcon"
import { formatDateComplitSlash } from "src/shared/hooks/formatDate-DD-MM-YY"
import HeaderLeft from "./components/header-left/HeaderLeft"
import VentasReservas from "./sections/ventas-y-reservas/VentasReservas"
import useEnergeticos from "./sections/energeticos/useEnergeticos"
import Gastos from "./sections/gastos/Gastos"
import MovimientosInventarios from "./sections/movimientos-inventarios/MovimientosInventarios"
import Matriculas from "./sections/matriculas/Matriculas"

const Reports = () => {
    const { localDateToUTCString, areSameDay } = useDate()
    const [dateFilter, setdateFilter] = useState<Date[] | null>(null)

    const apiDateFilter = dateFilter
        ? [
            FormatUTCDateToApiDate(localDateToUTCString(dateFilter[0]), true),
            FormatUTCDateToApiDate(localDateToUTCString(dateFilter[1]), true),
        ]
        : null

    const [sectionSelected, setsectionSelected] = useState<{ title: string; value: string }>(ReportsOptions.habs)

    const {GetEnergeticos, AgregarEnergeticoButton} = useEnergeticos({apiDateFilter})

    return (
        <Screen
            title={`${sectionSelected.title} - ${sectionSelected.value}`}
            close
            headerLeft={
                <HeaderLeft>
                    {(dateFilter?.length || 0) > 1 && areSameDay(dateFilter?.[0], dateFilter?.[1])
                        ? formatDateComplitSlash(dateFilter![0])
                        : dateFilter?.length === 2
                        ? `${formatDateComplitSlash(dateFilter![0])} al ${formatDateComplitSlash(dateFilter![1])}`
                        : ""}
                </HeaderLeft>
            }
            headerRight={
                <>
                    {sectionSelected.value === ReportsSubSections.historialEnergeticos &&
                        <AgregarEnergeticoButton />
                    }
                    <DateFilter onChange={(v) => setdateFilter(v)} />
                    <FloatingMenu
                        items={[
                            {
                                title: ReportsSections.habitacion,
                                subItems: [
                                    {
                                        title: ReportsOptions.habs.value,
                                        value: ReportsOptions.habs,
                                        onSelect: (v) => setsectionSelected(v),
                                    },
                                    {
                                        title: ReportsOptions.huespedes.value,
                                        value: ReportsOptions.huespedes,
                                        onSelect: (v) => setsectionSelected(v),
                                    },
                                    {
                                        title: ReportsOptions.limpSup.value,
                                        value: ReportsOptions.limpSup,
                                        onSelect: (v) => setsectionSelected(v),
                                    },
                                    {
                                        title: ReportsOptions.ventasHabYReservas.value,
                                        value: ReportsOptions.ventasHabYReservas,
                                        onSelect: (v) => setsectionSelected(v),
                                    },
                                ],
                            },
                            {
                                title: ReportsSections.finanzas,
                                subItems: [
                                    {
                                        title: ReportsOptions.artVendidos.value,
                                        value: ReportsOptions.artVendidos,
                                        onSelect: (v) => setsectionSelected(v),
                                    },
                                    {
                                        title: ReportsOptions.gastos.value,
                                        value: ReportsOptions.gastos,
                                        onSelect: (v) => setsectionSelected(v),
                                    },
                                    {
                                        title: ReportsOptions.propinas.value,
                                        value: ReportsOptions.propinas,
                                        onSelect: (v) => setsectionSelected(v),
                                    }
                                ],
                            },
                            {
                                title: ReportsSections.operacion,
                                subItems: [
                                    {
                                        title: ReportsOptions.matriculas.value,
                                        value: ReportsOptions.matriculas,
                                        onSelect: (v) => setsectionSelected(v),
                                    },
                                    {
                                        title: ReportsOptions.existenciaInventario.value,
                                        value: ReportsOptions.existenciaInventario,
                                        onSelect: (v) => setsectionSelected(v),
                                    },
                                    // {
                                    //     title: ReportsOptions.movimientosInventario.value,
                                    //     value: ReportsOptions.movimientosInventario,
                                    //     onSelect: (v) => setsectionSelected(v),
                                    // },
                                    {
                                        title: ReportsOptions.energeticos.value,
                                        value: ReportsOptions.energeticos,
                                        onSelect: (v) => setsectionSelected(v),
                                    },
                                    {
                                        title: ReportsOptions.incidencias.value,
                                        value: ReportsOptions.incidencias,
                                        onSelect: (v) => setsectionSelected(v),
                                    },
                                    {
                                        title: ReportsOptions.mantenimiento.value,
                                        value: ReportsOptions.mantenimiento,
                                        onSelect: (v) => setsectionSelected(v),
                                    },
                                ],
                            },
                        ]}
                    >
                        <ButtonIcon width="58px" iconName="PieChartFilled" theme="secondary" />
                    </FloatingMenu>
                </>
            }
        >
            {sectionSelected.value === ReportsSubSections.historialLimpieza ? (
                <ProductividadCamaristas apiDateFilter={apiDateFilter} />
            ) : sectionSelected.value === ReportsSubSections.historialArtVendidos ? (
                <ArticulosVendidos apiDateFilter={apiDateFilter} />
            ) : sectionSelected.value === ReportsSubSections.historialHuespedes ? (
                <Huespedes apiDateFilter={apiDateFilter} />
            ) : sectionSelected.value === ReportsSubSections.historialIncidencias ? (
                <Incidencias apiDateFilter={apiDateFilter} />
            ) : sectionSelected.value === ReportsSubSections.historialMantenimiento ? (
                <HistorialMantenimientos apiDateFilter={apiDateFilter} />
            ) : sectionSelected.value === ReportsSubSections.historialEnergeticos ? (
                <GetEnergeticos />
            ) : sectionSelected.value === ReportsSubSections.historialHabitaciones ? (
                <Habitaciones apiDateFilter={apiDateFilter} />
            ) : sectionSelected.value === ReportsSubSections.historialVentasYReserva ? (
                <VentasReservas apiDateFilter={apiDateFilter} />
            ) : sectionSelected.value === ReportsSubSections.historialGastos ? (
                <Gastos apiDateFilter={apiDateFilter} />
            ) : sectionSelected.value === ReportsSubSections.historialDeExistenciaInventarios ? (
                <Inventarios apiDateFilter={apiDateFilter} />
            ) : sectionSelected.value === ReportsSubSections.historialDeMovimientosInventarios ? (
                <MovimientosInventarios apiDateFilter={apiDateFilter} />
            ) : sectionSelected.value === ReportsSubSections.historialPropinas ? (
                <Propinas apiDateFilter={apiDateFilter} />
            ) : sectionSelected.value === ReportsSubSections.historialMatriculas ? (
                <Matriculas apiDateFilter={apiDateFilter} />
            ) : null}
        </Screen>
    )
}

export default Reports