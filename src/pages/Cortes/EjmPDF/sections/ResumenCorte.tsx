import { PDFViewer } from "@react-pdf/renderer"
import TicketResumen from "../components/TicketResumen/TicketResumen"
import { useProfile } from "src/shared/hooks/useProfile"
import { useFetch } from "src/shared/hooks/useFetch"
import { useEffect } from "react"
import { IResumenCorte } from "./interfaces/resumen-corte"
import { ResumenPagos } from "./interfaces/resumen-pagos"
import { useParams } from "react-router-dom"
import { useGetCorteQuery } from "src/gql/schema"
import { useDate } from "src/shared/hooks/useDate"
import { getDateFormat } from "src/pages/Cortes/Sections/ResumenTurno/hooks/useResumenParams"
import LoaderComponent from "src/shared/components/layout/loader/Loader"

function ResumenCorte(): JSX.Element {
    const { UTCStringToLocalDate } = useDate()

    const { corte_id = "" } = useParams()

    const { data } = useGetCorteQuery({
        variables: {
            corte_id,
        },
    })

    const { turno_hotel_id, hotel_id, usuario_id, myProfile, nombre_turno_hotel } = useProfile()

    const {
        data: resumen_corte,
        refetch: refetchResumenCorte,
        load: loadCorte,
    } = useFetch<IResumenCorte>("/cortes/resumen_corte_tickets", {
        defaultValue: null,
        startFetch: false,
    })

    const {
        data: resumen_pagos,
        refetch: refetchResumenPagos,
        load: loadPagos,
    } = useFetch<ResumenPagos>("/cortes/resumen_pagos", {
        defaultValue: null,
        startFetch: false,
    })

    useEffect(() => {
        if (turno_hotel_id && hotel_id && data) {
            refetchResumenCorte({
                fecha_inicio: getDateFormat(data?.corte?.fecha_inicio_corte, true),
                fecha_fin: getDateFormat(data?.corte?.fecha_fin_corte || "", true),
                hotel_id,
                turno_id: turno_hotel_id,
            })
            refetchResumenPagos({
                fecha_inicio: getDateFormat(data?.corte?.fecha_inicio_corte, true),
                fecha_fin: getDateFormat(data?.corte?.fecha_fin_corte || "", true),
                hotel_id,
                usuario_id,
                turno_id: turno_hotel_id,
            })
        }
    }, [turno_hotel_id, hotel_id, data])

    return !loadCorte && !loadPagos ? (
        <div style={{ width: "100%", height: "100%" }}>
            <PDFViewer style={{ width: "100%", height: "calc(100dvh - 48px)" }}>
                <TicketResumen
                    user={`${myProfile.nombre} ${myProfile.apellido_paterno}`}
                    resumenCorte={resumen_corte}
                    fechaInicioCorte={
                        data?.corte.fecha_inicio_corte
                            ? UTCStringToLocalDate(data.corte.fecha_inicio_corte)
                            : new Date()
                    }
                    resumenPagos={resumen_pagos}
                    turno={data?.corte.fecha_cierre_corte ? data.corte.turno.nombre : nombre_turno_hotel}
                    efectivo_ingresado={data?.corte.efectivo_ingresado}
                />
            </PDFViewer>
        </div>
    ) : (
        <LoaderComponent visible={true} />
    )
}

export default ResumenCorte
