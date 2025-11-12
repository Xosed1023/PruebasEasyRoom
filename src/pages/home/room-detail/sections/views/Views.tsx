import cx from "classnames"
import { ViewProps } from "./Views.type"
import { useRoom } from "../../hooks"
import { ROOM_STATUS } from "src/constants/room"
import "./Views.css"
import { Estados_Habitaciones } from "src/gql/schema"

export const View = ({
    className = "",
    style = {},
    children,
    title = "",
    subtitle = "",
    folio,
    titleStyle = {},
    subtitleStyle = {},
}: ViewProps): JSX.Element => {
    return (
        <div className={cx("detalle-h-view", className)} style={style}>
            <div className={cx({ "detalle-h-view__head": true, "detalle-h-view__head__space": !subtitle })}>
                <p className="detalle-h-view__title" style={titleStyle}>
                    {title}
                </p>
                {subtitle && (
                    <p className="detalle-h-view__subtitle" style={subtitleStyle}>
                        {subtitle} {folio ? `- ER-${folio.toString().padStart(3, "0")}` : ""}
                    </p>
                )}
            </div>
            {children}
        </div>
    )
}

export const HomeView = ({ title = "", subtitle = "", ...rest }: ViewProps): JSX.Element => {
    const { estado, limpieza_fecha_termino, folioReserva } = useRoom()

    const folio =
        estado === Estados_Habitaciones.Ocupada || estado === Estados_Habitaciones.Reservada ? folioReserva : ""

    const generateSubtitle = (): string => {
        if (estado !== "limpieza" && limpieza_fecha_termino === null) {
            return "Ocupada en limpieza"
        }
        return ROOM_STATUS[estado] || "Otro"
    }

    const finalSubtitle = subtitle || generateSubtitle()

    return <View title={title || "Nombre"} subtitle={finalSubtitle} folio={folio} {...rest} />
}

export const ListView = ({ className = "", ...rest }: ViewProps): JSX.Element => {
    return <View className={cx("detalle-h-view-list", className)} {...rest} />
}
