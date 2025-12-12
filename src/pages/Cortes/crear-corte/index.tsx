import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { client } from "src/graphql"
import { GET_INCIDENCIAS } from "./CrearCorte.graphql"
import { useProfile } from "src/shared/hooks/useProfile"
import { useDate } from "src/shared/hooks/useDate"
import CrearCorteInicidencias from "../Sections/CrearCorte/CrearCorte"
import ConfirmarCorte from "../Sections/ConfirmarCorte/ConfirmarCorte"
import ModalConfirmacion from "../Components/Modals/Confirmacion/Confirmacion"
import {
    Corte,
    useGetCorteLazyQuery,
    useResumen_Movimientos_Antes_CorteLazyQuery,
    useUltimo_CorteLazyQuery,
} from "src/gql/schema"
import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import CortePropina from "../Sections/CortePropina/CortePropina"
import { useReportePropinasData } from "src/pages/propinas/pago-propinas/pdf/reporte/data"


function CrearCorte(): JSX.Element {
    // Si se manda id es porque viene de un corte pendiente de cierre en la tabla de cortes, si no es para crear un nuevo corte
    const { corte_id = "" } = useParams()
    const [section, setSection] = useState<"incidencias" | "propinas">("incidencias")
    const [prevIncidencias, setIncidencias] = useState<any[]>([])
    const [fechaInicio, setFechaInicio] = useState<string>("")
    const [fechaFin, setFechaFin] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const turno = useTurnoActual()

    const { UTCStringToLocalDate } = useDate()

    const [openConfirm, setOpenConfirm] = useState<boolean>(false)
    const { hotel_id } = useProfile()

    const [corteSelected, setcorteSelected] = useState<Corte>()

    // Si se manda id es porque viene de un corte pendiente de cierre en la tabla de cortes, si no es para crear un nuevo corte
    const [getUltimoCorte] = useUltimo_CorteLazyQuery()

    // Consulta de propinas antes de cerrar corte
    const { data: dataPropinas, loading: loadPropinas, totals, res } = useReportePropinasData({
        whiteSpace: false,
    })

    const [isCorteSelectedUltimoCorte, setIsCorteSelectedUltimoCorte] = useState<boolean>()
    const [getCorteSelected] = useGetCorteLazyQuery()

    const [getResumenMovimientos, { data: resumenMovimientos }] = useResumen_Movimientos_Antes_CorteLazyQuery()

    useEffect(() => {
        // si no hay ultimo corte ni corte seleccionado es porque es el primer corte de la app por lo tanto se selecciona la hora de entrada del turno
        if (!turno) {
            return
        }
        if (!isCorteSelectedUltimoCorte && !corteSelected) {
            setFechaInicio(turno?.hora_entrada || "")
            setFechaFin(new Date().toISOString())
            return
        }
        if (isCorteSelectedUltimoCorte && corteSelected) {
            setFechaInicio(corteSelected?.fecha_fin_corte || "")
            setFechaFin(new Date().toISOString())
            return
        }
        if (!isCorteSelectedUltimoCorte && corteSelected) {
            setFechaInicio(corteSelected?.fecha_inicio_corte || "")
            setFechaFin(corteSelected?.fecha_fin_corte || "")
            return
        }
    }, [isCorteSelectedUltimoCorte, corteSelected])

    useEffect(() => {
        if (!turno?.turno_id) {
            return
        }
        if (corte_id) {
            getCorteSelected({
                variables: {
                    corte_id,
                },
            }).then(({ data }) => {
                setcorteSelected(data?.corte as Corte)
                setIsCorteSelectedUltimoCorte(false)
            })
            return
        }
        getUltimoCorte({
            variables: {
                hotel_id,
            },
        }).then(({ data }) => {
            setcorteSelected(data?.ultimo_corte as Corte)
            setIsCorteSelectedUltimoCorte(true)
        })
    }, [turno, corte_id])

    useEffect(() => {
        if (turno?.turno_id && fechaInicio && fechaFin) {
            getResumenMovimientos({
                variables: {
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin,
                    hotel_id,
                },
            })
        }
    }, [turno?.turno_id, fechaInicio])

    const handleFetch = () => {
        if (!fechaInicio) {
            return
        }
        setLoading(true)
        client
            .query({
                query: GET_INCIDENCIAS,
                variables: {
                    hotel_id,
                    turno_id: turno?.turno_id,
                    estado: "activa",
                    fecha_registro: {
                        fecha_inicial: fechaInicio,
                        fecha_final: fechaFin,
                    },
                },
            })
            .then(({ data }) => {
                const dataIncidencias = data?.incidencias || []
                if (dataIncidencias?.length > 0) {
                    setIncidencias(dataIncidencias)
                } else {
                    setIncidencias([])
                }
            })
            .catch((e) => {
                setIncidencias([])
                console.log(e)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        if (turno?.turno_id && fechaInicio) {
            handleFetch()
        } else if (loading) {
            setTimeout(() => {
                setLoading(false)
            }, 5000)
        }
    }, [turno?.turno_id, fechaInicio])

    const onRefresh = () => handleFetch()

    const onConfirm = () => {
        const withPropinas = (res || []).length > 0
        if (!corte_id && withPropinas) {
            setSection("propinas")
            return
        }

        setOpenConfirm(true)
    }

    return (
        <>
            {!loading ? (
                section === "incidencias" ? (
                    prevIncidencias?.length > 0 ? (
                        <CrearCorteInicidencias
                            incidencias={prevIncidencias}
                            onRefresh={onRefresh}
                            onConfirm={onConfirm}
                            turno={turno?.nombre || ""}
                        />
                    ) : (
                        <ConfirmarCorte onConfirm={onConfirm} />
                    )
                ) : (
                    <CortePropina res={dataPropinas} loading={loadPropinas} totals={totals}  onConfirm={() => setOpenConfirm(true)} />
                )
            ) : null}
            <ModalConfirmacion
                openImpresion={openConfirm}
                setOpenImpresion={setOpenConfirm}
                isUltimoCorte={isCorteSelectedUltimoCorte}
                corteSelected={corteSelected}
                numero_total_movimientos={resumenMovimientos?.movimientos_antes_corte?.numero_total_movimientos}
                suma_total_montos={resumenMovimientos?.movimientos_antes_corte?.suma_total_montos}
                fechaCorte={UTCStringToLocalDate(corteSelected?.fecha_fin_corte || "")}
                nombreTurnoCorte={corte_id ? corteSelected?.turno?.nombre : (turno?.nombre || "")}
                corte_id={corte_id}
            />
        </>
    )
}

export default CrearCorte
