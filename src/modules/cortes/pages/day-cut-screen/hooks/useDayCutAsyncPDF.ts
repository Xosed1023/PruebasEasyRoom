import { useAlmacenCorteLazyQuery } from "@/gql/schema"
import { useFetch } from "@/modules/cortes/hooks/useFetch"
import FormatUTCDateToApiDate from "@/modules/cortes/helpers/FormatUTCDateToApiDate"
import { ICortes } from "../../interfaces/cortes-pdf"
import { InventarioResponse } from "../InventoryPage/InventoryPage.interface"
import { dateHelpers } from "@/helpers/dateHelpers"

const useDayCutAsyncPDF = ({ hotel_id }: { hotel_id: string }) => {
    const [getAlmacenes] = useAlmacenCorteLazyQuery()
    const { localDateToUTCString } = dateHelpers()

    const { refetch: refetchCaratula } = useFetch<ICortes>("/cortes/cortes_pdf", {
        defaultValue: null,
        startFetch: false,
    })

    const { refetch: refetchInventario } = useFetch<InventarioResponse | undefined>(
        "/cortes/reporte_inventario_cards",
        {
            defaultValue: null,
            startFetch: false,
        }
    )

    const getData = async ({ dates }: { dates: Date[] | null }) => {
        if (!dates?.length) {
            return
        }
        return getAlmacenes().then(({ data: almacenes }) => {
            const almacen_id = almacenes?.almacenes[0]?.almacen_id

            return Promise.all([
                refetchInventario({
                    almacen_id,
                    hotel_id: hotel_id,
                    fecha_inicio: FormatUTCDateToApiDate(localDateToUTCString(dates[0]), true),
                    fecha_fin: FormatUTCDateToApiDate(localDateToUTCString(dates[1]), true),
                }),
                refetchCaratula({
                    hotel_id,
                    fecha_inicio: FormatUTCDateToApiDate(localDateToUTCString(dates[0]), true),
                    fecha_fin: FormatUTCDateToApiDate(localDateToUTCString(dates[1]), true),
                }),
            ]).then((res) => {
                return {
                    cortes_pdf: res[1],
                    inventario: res[0],
                }
            })
        })
    }

    return { getData }
}

export default useDayCutAsyncPDF
