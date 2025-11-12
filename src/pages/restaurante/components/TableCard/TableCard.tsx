import Icon from "src/shared/icons"
import "./TableCard.css"
import { EstadoMesa } from "src/gql/schema"
import { CSSProperties, useEffect, useState } from "react"
import { useDate } from "src/shared/hooks/useDate"
import { useToggleFlag } from "src/shared/hooks/useToggleFlag"
import { useCurrentDate } from "src/shared/providers/CurrentdateProvider"
import { formatTime } from "src/shared/utils/formatTime"

export const TableCard = ({ onSelect, mesa, style }: { onSelect: () => void; mesa: any; style?: CSSProperties }) => {
    const { UTCStringToLocalDate } = useDate()
    const [now] = useCurrentDate()

    const state = mesa.estado_dinamico ? mesa.estado_dinamico.estado_activo : mesa.estado
    const waiter = mesa?.asignacion_actual?.colaborador_atendio
        ? mesa?.asignacion_actual?.colaborador_atendio?.nombre +
          " " +
          mesa?.asignacion_actual?.colaborador_atendio?.apellido_paterno +
          " "
        : "-"

    const mesaIcons = {
        disponible: "check",
        en_servicio: "UserParentFill",
        en_preparacion: "RecipeHistory",
        por_entregar: "Order",
        pago_pendiente: "IconPendingPayment",
        sucia: "trashFilled",
        bloqueada: "LockFill",
    }

    // LOGICA PARA EL TIMER
    const [timeOrder, setTimeOrder] = useState<string>("00:00")

    useEffect(() => {
        const registro = new Date(
            mesa?.estado_dinamico?.estado_activo === "pago_pendiente"
                ? UTCStringToLocalDate(mesa?.asignacion_actual?.fecha_cuenta_cerrada)
                : UTCStringToLocalDate(mesa?.estado_dinamico?.comanda_activa?.fecha_registro)
        )
        const diferencia = now.getTime() - registro.getTime()

        const minutos = Math.floor(diferencia / (1000 * 60))
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000)

        setTimeOrder(`${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`)
    }, [mesa?.estado_dinamico?.comanda_activa?.fecha_registro, mesa?.fecha_modificacion, now])

    // LOGICA DEL COLOR
    function getClassName(timeOrder: string) {
        const [minutes, seconds] = timeOrder.split(":").map(Number)

        if (minutes < 25 || (minutes === 24 && seconds <= 59)) {
            return ""
        } else {
            return "restaurant-very-late" // Rojo: 25 en adelante
        }
    }

    const [isFirstColor] = useToggleFlag(true)

    return (
        <div
            style={{
                ...style,
                backgroundColor:
                    state === "por_entregar"
                        ? isFirstColor
                            ? "var(--ocupada-card-1)"
                            : "var(--pink-ocupado-light)"
                        : undefined,
            }}
            className={`table-card__wrapper${` state-${state}`}`}
            onClick={onSelect}
        >
            <div className={`table-card--icon_wrapper${` icon-${state}`}`}>
                <Icon
                    name={mesaIcons[state]}
                    color="#FFF"
                    secondarycolor={state === "pago_pendiente" ? "var(--error)" : ""}
                    width={15}
                    height={15}
                />
            </div>
            {state === EstadoMesa.Disponible || state === EstadoMesa.Sucia || state === EstadoMesa.Bloqueada ? (
                <div className="table-card--state_wrapper">
                    <p className="table-card--state_text">
                        {state === EstadoMesa.Bloqueada
                            ? mesa.motivo_bloqueo
                            : mesa.estado.charAt(0).toUpperCase() + mesa.estado.slice(1).toLowerCase()}
                    </p>
                </div>
            ) : state === EstadoMesa.EnServicio ? (
                <div className="table-card--state_wrapper_service">
                    <p className="table-card--state_servicio_text">{waiter}</p>
                    <p className="table-card--state_subtitle">En servicio</p>
                </div>
            ) : (
                <div className="table-card--state_wrapper_service">
                    <p className={`table-card--state_text ${getClassName(timeOrder)}`}>
                        {timeOrder.includes("NaN") ? "-" : formatTime({ time: timeOrder, withHours: true })}
                    </p>
                    <p className="table-card--state_subtitle">{waiter}</p>
                </div>
            )}
            <div className="table-card--info_wrapper">
                <div className="table_card--info_table">
                    <p className="table_card--info_table_title">Mesa</p>
                    <p className="table_card--info_table_text">{mesa.numero_mesa.toString().padStart(2, "0")}</p>
                </div>
                <div className="table_card--info_persons">
                    <Icon name="UserParentFill" width={12} height={12} />
                    <p className="table_card--info_persons_text">{mesa.cantidad_personas}</p>
                </div>
            </div>
        </div>
    )
}

export default TableCard
