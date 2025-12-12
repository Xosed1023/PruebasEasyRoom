import { useGetKpisMantenimientoQuery } from "src/gql/schema"
import "./Cards.css"
import { useProfile } from "src/shared/hooks/useProfile"
import { getMonthRange } from "../../helpers/getMonthRange"
import { useDate } from "src/shared/hooks/useDate"
import { ForwardedRef, forwardRef, useImperativeHandle } from "react"

export interface CardsMantenimientoRef {
    refetch: () => void
}

const Cards = ({ startDate }: { startDate: Date }, ref: ForwardedRef<CardsMantenimientoRef>) => {
    const { hotel_id } = useProfile()
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
                <span className="mantenimiento__screen__card__value">{(data?.kpis_mantenimientos.total_gas || 0).toFixed(4)} m³</span>
            </div>
            <div className="mantenimiento__screen__card">
                <span className="mantenimiento__screen__card__title">Consumo de luz</span>
                <span className="mantenimiento__screen__card__value">
                    {(data?.kpis_mantenimientos.total_luz || 0).toFixed(4)} kw
                </span>
            </div>
        </div>
    )
}

export default forwardRef(Cards)
