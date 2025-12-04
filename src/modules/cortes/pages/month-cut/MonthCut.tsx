import Screen from "@/components/core/layout/screen/Screen"
import NavbarNavigator from "@/components/core/navigation/navbar"
import Header from "../../components/header/Header"
import { useEffect, useState } from "react"
import EmptyState from "@/components/core/layout/empty-state/EmptyState"
import CutEmpty from "../../../../assets/svg/CutEmpty.svg"
import SectionTitle from "@/components/core/layout/section-title/SectionTitle"
import { formatDate } from "date-fns"
import { es } from "date-fns/locale"
import useSnackbar from "@/hooks/useSnackbar"
import { useParams } from "react-router"
import { UnidadTiempoFiltro, useCurrentDateLazyQuery, useGetCortesAgrupadosLazyQuery } from "@/gql/schema"
import { dateHelpers } from "@/helpers/dateHelpers"
import { useProfile } from "@/hooks/store/useProfile"
import CutListItemMonth from "./components/CutListITemMonth"
import useMonthCutAsync from "../month-cut-screen/hooks/useMonthCutAsync"
import MonthCutPDF from "../components/month-cut-pdf/MonthCutPDF"
import { pdf } from "@react-pdf/renderer"
import { v4 as uuid } from "uuid"
import { downloadAndOpenPdf } from "@/helpers/downloadPDF"
import MonthCutSkeleton from "./components/MonthCutSkeleton"

const MonthCut = () => {
    const [dates, setdates] = useState<{ fecha_final: string; fecha_inicial: string }>()
    const { hotel_id = "" } = useParams()
    const { getMontCutData } = useMonthCutAsync()
    const {
        usuario: { hotel },
    } = useProfile()

    const hotelSelected = hotel?.find((h) => h.hotel_id === hotel_id)
    const { UTCStringToLocalDate, getMonthName, getYearRange, getDayHoursRange } = dateHelpers()
    const [getCurrentDate] = useCurrentDateLazyQuery()
    const [getCortes, dataCortes] = useGetCortesAgrupadosLazyQuery()
    const [isLoading, setisLoading] = useState(false)

    const { showSnackbar } = useSnackbar()

    useEffect(() => {
        getCurrentDate().then((d) => {
            const { fecha_final, fecha_inicial } = getYearRange(UTCStringToLocalDate(d.data?.serverDate))
            setdates({
                fecha_final,
                fecha_inicial,
            })
        })
    }, [])

    useEffect(() => {
        if (!dates) {
            return
        }
        getCortes({
            variables: {
                hotel_id: hotelSelected?.hotel_id || hotel_id,
                unidad_tiempo: UnidadTiempoFiltro.Mes,
                fecha_cierre_corte: {
                    fecha_inicial: dates?.fecha_inicial,
                    fecha_final: dates?.fecha_final,
                },
            },
        })
    }, [dates])

    const downloadPdf = async ({ month, year }: { month: string; year: string }) => {
        setisLoading(true)
        getMontCutData({ hotel_id, month, year })
            .then(({ caratula, firstDay, hotelSelected, lastDay, numDays }) => {
                if (!caratula || !firstDay || !hotelSelected || !lastDay || !numDays) {
                    return
                }
                const fileName = uuid()
                pdf(
                    <MonthCutPDF
                        caratula={caratula}
                        firstDay={firstDay}
                        lastDay={lastDay}
                        numDays={numDays}
                        logo_hotel={hotelSelected.logo_hotel || ""}
                        nombre_hotel={hotelSelected.nombre_hotel}
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

    return (
        <Screen
            className="gap-y-[20px] flex flex-col mt-[24px]"
            header={
                <Header
                    title="Reportes mensuales"
                    onSelectDate={(dates) => setdates(getDayHoursRange(dates))}
                    withDayPicker={false}
                />
            }
            footer={<NavbarNavigator />}
        >
            <SectionTitle title={dates ? formatDate(dates.fecha_inicial, "yyyy", { locale: es }) : ""} />
            <div className="flex flex-col gap-y-[20px] overflow-y-auto h-[calc(100%-80px)]">
                {dataCortes.loading && <MonthCutSkeleton />}
                {!dataCortes.loading &&
                    dataCortes?.data?.cortes_agrupados?.map((report, index) => (
                        <CutListItemMonth
                            loading={isLoading}
                            setIsLoading={setisLoading}
                            month={new Date(report.fecha).getUTCMonth()}
                            year={formatDate(report.fecha, "yyyy", { locale: es }).toString()}
                            key={index}
                            onSelect={downloadPdf}
                            title={getMonthName(report.fecha)}
                            value={report.total_corte}
                        />
                    ))}
                {!dataCortes.loading && dataCortes.data && dataCortes.data.cortes_agrupados.length === 0 && (
                    <EmptyState
                        image={<img src={CutEmpty} />}
                        description="Aún no tienes reportes mensuales"
                        title="Sin reportes mensuales"
                    />
                )}
            </div>
        </Screen>
    )
}

export default MonthCut
