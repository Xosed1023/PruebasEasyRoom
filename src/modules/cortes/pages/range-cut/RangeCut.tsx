import Screen from "@/components/core/layout/screen/Screen"
import NavbarNavigator from "@/components/core/navigation/navbar"
import Header from "../../components/header/Header"
import { useEffect, useState } from "react"
import SectionTitle from "@/components/core/layout/section-title/SectionTitle"
import formatDateDDMMMYYYY from "@/helpers/formatDateDDMMMYYYY"
import { Corte, Hotel, useGetCortesHistorialLazyQuery } from "@/gql/schema"
import EmptyState from "@/components/core/layout/empty-state/EmptyState"
import CutEmpty from "../../../../assets/svg/CutEmpty.svg"
import { useLocation, useParams } from "react-router"
import useSnackbar from "@/hooks/useSnackbar"
import { pdf } from "@react-pdf/renderer"
import TurnCutPDF from "../components/turn-cut-pdf/TurnCutPDF"
import useTurnCutAsyncPDF from "../turn-cut-screen/PropinasPage/hooks/usetTurnCutAsyncPDF"
import { downloadAndOpenPdf } from "@/helpers/downloadPDF"
import CutListItemRange from "./components/CutListItemRange"

const RangeCut = () => {
    const [date, setDate] = useState<Date | null>(null)

    const { hotel_id = "" } = useParams()
    const { state } = useLocation()

    const [getHistorial, data] = useGetCortesHistorialLazyQuery()
    const { showSnackbar } = useSnackbar()

    useEffect(() => {
        getHistorial({
            variables: {
                hotel_id,
                fecha_inicio_corte: {
                    fecha_final: state.end,
                    fecha_inicial: state.start,
                },
            },
        })
    }, [date])

    const { getTurnCutData } = useTurnCutAsyncPDF({
        hotel_id,
    })

    const downloadPdf = async ({ cut }: { cut: Corte }) => {
        getTurnCutData({ cut_id: cut.corte_id }).then((res) => {
            pdf(
                <TurnCutPDF
                    cortes_pdf={res.cortes_pdf}
                    corte={res.corte}
                    hotelSelected={res.hotelSelected as Hotel}
                    reportePropinas={res.reportePropinas}
                    inventario={res.inventario}
                />
            )
                .toBlob()
                .then((blob) => {
                    downloadAndOpenPdf({ blob: blob, ext: "pdf", filename: cut.corte_id }).then(() => {
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
        })
    }

    return (
        <Screen
            className="gap-y-[20px] flex flex-col mt-[24px]"
            header={<Header title="Cortes por turno" onSelectDate={(date) => setDate(date)} />}
            footer={<NavbarNavigator />}
        >
            <SectionTitle title={formatDateDDMMMYYYY({ date: date || new Date() })} />
            <div className="flex flex-col gap-y-[20px] overflow-y-auto h-[calc(100%-80px)]">
                {data?.data?.cortes.map((cut, index) => (
                    <CutListItemRange key={index} cut={cut as Corte} onSelect={(cut) => downloadPdf({ cut })} />
                ))}
                {(!data?.data?.cortes || data.data.cortes.length === 0) && (
                    <EmptyState
                        image={<img src={CutEmpty} />}
                        description="Consulta y cierra los cortes de turno para obtener el corte del día"
                        title="No hay cortes de turnos cerrados."
                    />
                )}
            </div>
        </Screen>
    )
}

export default RangeCut
