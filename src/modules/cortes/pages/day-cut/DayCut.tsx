import Screen from "@/components/core/layout/screen/Screen"
import NavbarNavigator from "@/components/core/navigation/navbar"
import Header from "../../components/header/Header"
import { useEffect, useState } from "react"
import EmptyState from "@/components/core/layout/empty-state/EmptyState"
import CutEmpty from "../../../../assets/svg/CutEmpty.svg"
import SectionTitle from "@/components/core/layout/section-title/SectionTitle"
import formatDateMMMM_YYYY from "@/helpers/formatDateMMMM_YYYY"
import { dateHelpers } from "@/helpers/dateHelpers"
import {
    useCurrentDateLazyQuery,
    useGetCortesAgrupadosLazyQuery,
    UnidadTiempoFiltro,
    GroupCortes,
    Hotel,
} from "@/gql/schema"
import { useParams } from "react-router"
import { useProfile } from "@/hooks/store/useProfile"
import CutListItemDay from "./components/CutListItemDay"
import DayCutPDF from "../components/day-cut-pdf/DayCutPDF"
import { pdf } from "@react-pdf/renderer"
import useSnackbar from "@/hooks/useSnackbar"
import { getFechaFin, getFechaInicio } from "../helpers/cutDates"
import useDayCutAsyncPDF from "../day-cut-screen/hooks/useDayCutAsyncPDF"
import { downloadAndOpenPdf } from "@/helpers/downloadPDF"
import { formatDateComplitSlash } from "@/helpers/formatDate-DD-MM-YY"
import FloatButton from "@/components/core/general/float-button/FloatButton"

const DayCut = () => {
    const { UTCStringToLocalDate, getMonthRange, setHHMMSS } = dateHelpers()
    const [getCurrentDate] = useCurrentDateLazyQuery()
    const { hotel_id = "" } = useParams()
    const { showSnackbar } = useSnackbar()
    const {
        usuario: { hotel },
    } = useProfile()
    const [dates, setdates] = useState<Date[]>([])

    const hotelSelected = hotel?.find((h) => h.hotel_id === hotel_id)
    useEffect(() => {
        getCurrentDate().then((d) => {
            const { fecha_inicial } = getMonthRange(UTCStringToLocalDate(d.data?.serverDate))
            setdates([UTCStringToLocalDate(fecha_inicial)])
        })
    }, [])

    const [getCortes, dataCortes] = useGetCortesAgrupadosLazyQuery()

    const { localDateToUTCString } = dateHelpers()

    useEffect(() => {
        if (!dates || !dates.length) {
            return
        }
        getCortes({
            variables: {
                hotel_id: hotelSelected?.hotel_id || hotel_id,
                unidad_tiempo: UnidadTiempoFiltro.Dia,
                fecha_cierre_corte: {
                    fecha_inicial: localDateToUTCString(dates[0]),
                    fecha_final: localDateToUTCString(
                        dates[1] ? dates[1] : setHHMMSS({ startDate: dates[0], newHour: "23:59:59" })
                    ),
                },
            },
        })
    }, [dates])

    const { getData } = useDayCutAsyncPDF({
        hotel_id,
    })
    const [isLoading, setisLoading] = useState(false)

    const downloadPdf = async ({ cut }: { cut: GroupCortes }) => {
        setisLoading(true)
        const fechaInicio = getFechaInicio(cut.cortes.map((c) => UTCStringToLocalDate(c.fecha_inicio_corte)))
        const fechaFin = getFechaFin(
            cut.cortes.map((c) =>
                c.fecha_fin_corte
                    ? UTCStringToLocalDate(c.fecha_fin_corte || "")
                    : setHHMMSS({
                          startDate: UTCStringToLocalDate(c.fecha_corte || ""),
                          newHour: "23:59:59.999",
                          isNewHourInUTC: false,
                      })
            )
        )
        const formattedDates = [fechaInicio!, fechaFin!]
        getData({ dates: formattedDates })
            .then((res) => {
                if (!res) {
                    return
                }
                const fileName = cut?.cortes[0].corte_id
                pdf(
                    <DayCutPDF
                        cortes_pdf={res.cortes_pdf}
                        hotelSelected={hotelSelected as Hotel}
                        dates={formattedDates}
                        folios={cut?.cortes.map((c) => String(c.folio)) || []}
                        inventario={res.inventario}
                    />
                )
                    .toBlob()
                    .then((blob) => {
                        downloadAndOpenPdf({ blob: blob, ext: "pdf", filename: fileName }).then(() => {
                            showSnackbar({
                                text: "Consulta el PDF del reporte desde tu sección de archivos",
                                status: "success",
                                title: "Descarga exitosa",
                            })
                        })
                    })
                    .catch(() => {
                        showSnackbar({
                            text: "Verifica tu conexión a internet o inténtalo nuevamente",
                            status: "error",
                            title: "Error al descargar el PDF",
                        })
                    })
                    .finally(() => {
                        setisLoading(false)
                    })
            })
            .catch(() => {
                showSnackbar({
                    text: "Verifica tu conexión a internet o inténtalo nuevamente",
                    status: "error",
                    title: "Error al descargar el PDF",
                })
            })
            .finally(() => {
                setisLoading(false)
            })
    }

    const [isRangeLoading, setisRangeLoading] = useState(false)

    const downloadPdfRange = () => {
        if(isRangeLoading) {
            return
        }
        setisRangeLoading(true)
        const dates =
            dataCortes.data?.cortes_agrupados.flatMap((group) =>
                group.cortes.map((cut) => ({
                    fecha_inicio_corte: UTCStringToLocalDate(cut.fecha_inicio_corte),
                    fecha_fin_corte: UTCStringToLocalDate(cut.fecha_fin_corte || cut.fecha_inicio_corte),
                    folio: cut.folio,
                }))
            ) || []
        const fechaInicio = new Date(Math.min(...dates.map((d) => d.fecha_inicio_corte.getTime())))
        const fechaFin = new Date(Math.max(...dates.map((d) => d.fecha_fin_corte.getTime())))
        const formattedDates = [fechaInicio!, fechaFin!]
        getData({ dates: formattedDates })
            .then((res) => {
                if (!res) {
                    return
                }
                const fileName = "corte_rango"
                pdf(
                    <DayCutPDF
                        cortes_pdf={res.cortes_pdf}
                        hotelSelected={hotelSelected as Hotel}
                        dates={formattedDates}
                        folios={dates.map((c) => String(c.folio)) || []}
                        inventario={res.inventario}
                    />
                )
                    .toBlob()
                    .then((blob) => {
                        downloadAndOpenPdf({ blob: blob, ext: "pdf", filename: fileName }).then(() => {
                            showSnackbar({
                                text: "Consulta el PDF del reporte desde tu sección de archivos",
                                status: "success",
                                title: "Descarga exitosa",
                            })
                        })
                    })
                    .catch(() => {
                        showSnackbar({
                            text: "Verifica tu conexión a internet o inténtalo nuevamente",
                            status: "error",
                            title: "Error al descargar el PDF",
                        })
                    })
                    .finally(() => {
                        setisRangeLoading(false)
                    })
            })
            .catch(() => {
                showSnackbar({
                    text: "Verifica tu conexión a internet o inténtalo nuevamente",
                    status: "error",
                    title: "Error al descargar el PDF",
                })
                setisRangeLoading(false)
            })
    }

    return (
        <Screen
            className="gap-y-[20px] flex flex-col mt-[24px]"
            header={<Header isRange onDatesRangeChange={setdates} startDatesRangeValue={dates} title="Cortes de día" />}
            footer={<NavbarNavigator />}
        >
            <SectionTitle
                title={
                    dates[1]
                        ? `${formatDateComplitSlash(dates[0] || new Date())} al ${formatDateComplitSlash(
                              dates[1] || new Date()
                          )}`
                        : formatDateMMMM_YYYY({ date: dates[0] || new Date() })
                }
            />
            <div className="flex flex-col gap-y-[20px] overflow-y-auto h-[calc(100%-80px)]">
                {dataCortes?.data?.cortes_agrupados.map((cut, index) => (
                    <CutListItemDay
                        loading={isLoading}
                        setIsLoading={setisLoading}
                        key={index}
                        cut={cut as GroupCortes}
                        onSelect={(cut) => downloadPdf({ cut })}
                    />
                ))}
                {(!dataCortes?.data?.cortes_agrupados || dataCortes?.data?.cortes_agrupados.length === 0) && (
                    <EmptyState
                        image={<img src={CutEmpty} />}
                        description="Consulta y cierra los cortes de turno para obtener el corte del día"
                        title="Sin cortes diarios"
                    />
                )}
            </div>
            {dataCortes?.data?.cortes_agrupados && dataCortes?.data?.cortes_agrupados.length > 1 && (
                <FloatButton
                    onClick={() => downloadPdfRange()}
                    iconName={isRangeLoading ? "IconLoader" : "Download"}
                />
            )}
        </Screen>
    )
}

export default DayCut
