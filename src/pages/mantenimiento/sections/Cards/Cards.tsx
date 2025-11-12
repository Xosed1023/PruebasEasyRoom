import { Estados_Incidencias, TiposIncidencias, useGetKpisMantenimientoQuery } from "src/gql/schema"
import "./Cards.css"
import { useProfile } from "src/shared/hooks/useProfile"
import { getMonthRange } from "../../helpers/getMonthRange"
import { useDate } from "src/shared/hooks/useDate"
import { ForwardedRef, forwardRef, useImperativeHandle } from "react"
import { useNavigate } from "react-router-dom"

export interface CardsMantenimientoRef {
    refetch: () => void
}

const Cards = ({ startDate }: { startDate: Date }, ref: ForwardedRef<CardsMantenimientoRef>) => {
    const { hotel_id } = useProfile()
    const navigate = useNavigate()
    const { localDateToUTCString } = useDate()
    const dates = getMonthRange(startDate)
    const { data, refetch } = useGetKpisMantenimientoQuery({
        variables: {
            fecha_registro: {
                fecha_inicial: localDateToUTCString(dates.start),
                fecha_final: localDateToUTCString(dates.end),
            },
            hotel_id,
        },
    })

    useImperativeHandle(ref, () => ({ refetch }))

    return (
        <div className="mantenimiento__screen__cards">
            <div className="mantenimiento__screen__card">
                <span className="mantenimiento__screen__card__title">Consumo de agua</span>
                <span className="mantenimiento__screen__card__value">
                    {data?.kpis_mantenimientos.total_agua || 0} L
                </span>
            </div>
            <div className="mantenimiento__screen__card">
                <span className="mantenimiento__screen__card__title">Consumo de gas</span>
                <span className="mantenimiento__screen__card__value">{(data?.kpis_mantenimientos.total_gas || 0).toFixed(4)} L</span>
            </div>
            <div className="mantenimiento__screen__card">
                <span className="mantenimiento__screen__card__title">Consumo de luz</span>
                <span className="mantenimiento__screen__card__value">
                    {(data?.kpis_mantenimientos.total_luz || 0).toFixed(4)} kw
                </span>
            </div>
            <div className="mantenimiento__screen__card">
                <span className="mantenimiento__screen__card__title">Incidencias pendientes</span>
                <span className="mantenimiento__screen__card__value--alert">
                    {data?.kpis_mantenimientos.incidencias_pendientes || 0}
                </span>
                <span
                    className="mantenimiento__screen__card__link"
                    onClick={() => {
                        navigate("/u/incidencias", {
                            state: {
                                subtipo_filter: TiposIncidencias.Mantenimiento,
                                estado: Estados_Incidencias.Activa
                            },
                        })
                    }}
                >
                    Ver detalle
                </span>
            </div>
            <div className="mantenimiento__screen__card">
                <span className="mantenimiento__screen__card__title">Incidencias cerradas</span>
                <span className="mantenimiento__screen__card__value">
                    {data?.kpis_mantenimientos.incidencias_cerradas || 0}
                </span>
                <span
                    className="mantenimiento__screen__card__link"
                    onClick={() => {
                        navigate("/u/incidencias", {
                            state: {
                                subtipo_filter: TiposIncidencias.Mantenimiento,
                                estado: Estados_Incidencias.Cerrada,
                            },
                        })
                    }}
                >
                    Ver detalle
                </span>
            </div>
            <div className="mantenimiento__screen__card">
                <span className="mantenimiento__screen__card__title">Bloqueos por mantenimiento</span>
                <span className="mantenimiento__screen__card__value">
                    {data?.kpis_mantenimientos.habitaciones_bloqueadas || 0}
                </span>
            </div>
        </div>
    )
}

export default forwardRef(Cards)
