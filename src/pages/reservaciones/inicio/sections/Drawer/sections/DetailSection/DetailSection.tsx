import "./DetailSection.css"
import { TabsNavigation } from "../TabsNavigation/TabsNavigation"
import { GetReservacionesTableQuery } from "src/gql/schema"

export const DetailSection = ({
    sentReservaD,
    asignada = false,
}: {
    sentReservaD?: GetReservacionesTableQuery["reservas"][0]
    asignada?: boolean
}) => {
    if (sentReservaD)
        return (
            <div>
                <div className="detalle-h-view__head" style={{ marginTop: 24 }}>
                    <p className="detalle-h-view__title">{`Reserva ${sentReservaD.folio || ""}`}</p>
                    {sentReservaD?.estado === "cancelada" ? (
                        <p
                            className="detalle-h-view__subtitle"
                            style={{
                                color: "var(--pink-ocupado)",
                            }}
                        >
                            Cancelada
                            <span
                                className="detalle-h-view__subtitle"
                                style={{
                                    color: "var(--pink-ocupado)",
                                    fontWeight: 700,
                                }}
                            >{` ER-${sentReservaD?.folio?.toString().padStart(3, "0") || ""}`}</span>
                        </p>
                    ) : (
                        sentReservaD.habitacion_id && (
                            <p className="detalle-h-view__subtitle">
                                {`Habitación -  ${sentReservaD?.habitacion?.numero_habitacion || ""}`}
                            </p>
                        )
                    )}
                </div>
                <TabsNavigation asignada={asignada} reserva={sentReservaD} />
            </div>
        )
    else return <></>
}
