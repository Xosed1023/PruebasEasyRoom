import { Corte, useAlmacenCorteLazyQuery, useGetCorteTurnoPdfLazyQuery } from "@/gql/schema"
import { useProfile } from "@/hooks/store/useProfile"
import { useFetch } from "@/modules/cortes/hooks/useFetch"
import { ICortes } from "../../../interfaces/cortes-pdf"
import { InventarioResponse } from "../../InventoryPage/InventoryPage.interface"
import FormatUTCDateToApiDate from "@/modules/cortes/helpers/FormatUTCDateToApiDate"
import { useFetchReporte, useReportePropinasAsyncData } from "./useReportePropinaAsyncData"

const useTurnCutAsyncPDF = ({ hotel_id }: { hotel_id?: string }) => {
    const [getAlmacenes] = useAlmacenCorteLazyQuery()
    const { getReporte } = useFetchReporte({ hotel_id })
    const [getCorte] = useGetCorteTurnoPdfLazyQuery()
    const { getTurnCutData: getPropinasData } = useReportePropinasAsyncData({ whiteSpace: true, getReporte })

    const { refetch: refetchCaratula } = useFetch<ICortes>("/cortes/cortes_pdf", {
        defaultValue: null,
        startFetch: false,
    })

    const {
        usuario: { hotel },
    } = useProfile()

    const hotelSelected = hotel?.find((h) => h.hotel_id === hotel_id)

    const { refetch: refetchInventario } = useFetch<InventarioResponse | undefined>(
        "/cortes/reporte_inventario_cards",
        {
            defaultValue: null,
            startFetch: false,
        }
    )

    const getTurnCutData = async ({ cut_id }: { cut_id: string }) => {
        return getCorte({
            variables: {
                corte_id: cut_id,
            },
        }).then((cutdata) => {
            const cut = cutdata.data?.corte!
            return getAlmacenes().then(async (almacenes) => {
                const almacen_id = almacenes[0]?.almacen_id
                const [inventario, propinas, cortes_pdf] = await Promise.all([
                    refetchInventario({
                        almacen_id,
                        hotel_id: hotel_id,
                        fecha_inicio: FormatUTCDateToApiDate(cut.fecha_inicio_corte, true),
                        fecha_fin: FormatUTCDateToApiDate(cut.fecha_fin_corte!, true),
                    }),
                    getPropinasData({
                        fecha_inicio: FormatUTCDateToApiDate(cut.fecha_inicio_corte, true),
                        fecha_fin: FormatUTCDateToApiDate(cut.fecha_fin_corte!, true),
                    }),
                    refetchCaratula({
                        hotel_id,
                        fecha_inicio: FormatUTCDateToApiDate(cut.fecha_inicio_corte, true),
                        fecha_fin: FormatUTCDateToApiDate(cut.fecha_fin_corte!, true),
                    }),
                ])

                return {
                    hotelSelected,
                    cortes_pdf,
                    inventario,
                    reportePropinas: propinas,
                    corte: cut as Corte,
                }
            })
        })
    }
    return { getTurnCutData }
}

export default useTurnCutAsyncPDF
