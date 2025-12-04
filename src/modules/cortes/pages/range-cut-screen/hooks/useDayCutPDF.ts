import { useAlmacenCorteQuery } from "@/gql/schema"
import { useProfile } from "@/hooks/store/useProfile"
import { useFetch } from "@/modules/cortes/hooks/useFetch"
import { useEffect, useMemo } from "react"
import FormatUTCDateToApiDate from "@/modules/cortes/helpers/FormatUTCDateToApiDate"
import { ICortes } from "../../interfaces/cortes-pdf"
import { InventarioResponse } from "../InventoryPage/InventoryPage.interface"
import { dateHelpers } from "@/helpers/dateHelpers"

const useDayCutPDF = ({ dates, hotel_id }: { dates: Date[] | null; hotel_id?: string }) => {
    const { data: almacenes } = useAlmacenCorteQuery()
    const { localDateToUTCString} = dateHelpers()
    const {
        usuario: { hotel },
    } = useProfile()

    const hotelSelected = hotel?.find((h) => h.hotel_id === hotel_id)

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
        if (almacen_id && dates && dates.length) {
            refetchInventario({
                almacen_id,
                hotel_id: hotel_id,
                fecha_inicio: FormatUTCDateToApiDate(localDateToUTCString(dates[0]), true),
                fecha_fin: FormatUTCDateToApiDate(localDateToUTCString(dates[1]), true),
            })
        }
    }, [almacenes, dates])

    useEffect(() => {
        if (dates && dates.length) {
            refetchCaratula({
                hotel_id,
                fecha_inicio: FormatUTCDateToApiDate(localDateToUTCString(dates[0]), true),
                fecha_fin: FormatUTCDateToApiDate(localDateToUTCString(dates[1]), true),
            })
        }
    }, [dates])

    const turnData = useMemo(
        () => ({
            hotelSelected,
            cortes_pdf,
            inventario,
        }),
        [hotelSelected, cortes_pdf, inventario, dates]
    )

    return turnData
}

export default useDayCutPDF
