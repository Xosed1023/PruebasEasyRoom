import { Corte, useAlmacenCorteQuery, useGetCorteTurnoPdfLazyQuery } from "@/gql/schema"
import { useProfile } from "@/hooks/store/useProfile"
import { useFetch } from "@/modules/cortes/hooks/useFetch"
import { useEffect, useMemo } from "react"
import { ICortes } from "../../../interfaces/cortes-pdf"
import { InventarioResponse } from "../../InventoryPage/InventoryPage.interface"
import FormatUTCDateToApiDate from "@/modules/cortes/helpers/FormatUTCDateToApiDate"
import { useReportePropinasData } from "./useReportePropinasData"

const useTurnCutPDF = ({ cut_id, hotel_id }: { cut_id?: string; hotel_id?: string }) => {
    const { data: almacenes } = useAlmacenCorteQuery()
    const [getCorte, corte] = useGetCorteTurnoPdfLazyQuery()
    const {
        usuario: { hotel },
    } = useProfile()

    const hotelSelected = hotel?.find((h) => h.hotel_id === hotel_id)

    useEffect(() => {
        if (cut_id) {
            getCorte({
                variables: {
                    corte_id: cut_id,
                },
            })
        }
    }, [cut_id])

    const {
        data: cortes_pdf,
        // load: loadCorte,
        refetch: refetchCaratula,
    } = useFetch<ICortes>("/cortes/cortes_pdf", {
        defaultValue: null,
        startFetch: false,
    })

    const { data: inventario, refetch: refetchInventario } = useFetch<InventarioResponse | undefined>(
        "/cortes/reporte_inventario_cards",
        {
            defaultValue: null,
            startFetch: false,
        }
    )

    useEffect(() => {
        const almacen_id = almacenes?.almacenes[0]?.almacen_id
        if (almacen_id && corte.data) {
            refetchInventario({
                almacen_id,
                hotel_id: hotel_id,
                fecha_inicio: FormatUTCDateToApiDate(corte.data.corte.fecha_inicio_corte, true),
                fecha_fin: FormatUTCDateToApiDate(corte.data.corte.fecha_fin_corte!, true),
            })
        }
    }, [almacenes, corte.data])

    useEffect(() => {
        if (corte.data && cut_id) {
            refetchCaratula({
                hotel_id,
                fecha_inicio: FormatUTCDateToApiDate(corte.data.corte.fecha_inicio_corte, true),
                fecha_fin: FormatUTCDateToApiDate(corte.data.corte.fecha_fin_corte!, true),
            })
        }
    }, [corte, cut_id])

    const reportePropinas = useReportePropinasData({
        corte_id: cut_id,
        fecha_inicio: FormatUTCDateToApiDate(corte?.data?.corte?.fecha_inicio_corte!, true),
        fecha_fin: FormatUTCDateToApiDate(corte?.data?.corte.fecha_fin_corte!, true),
    })

    const turnData = useMemo(
        () => ({
            hotelSelected,
            cortes_pdf,
            inventario,
            reportePropinas,
            corte: corte.data?.corte as Corte,
        }),
        [hotelSelected, cortes_pdf, inventario, reportePropinas, corte]
    )

    return turnData
}

export default useTurnCutPDF
