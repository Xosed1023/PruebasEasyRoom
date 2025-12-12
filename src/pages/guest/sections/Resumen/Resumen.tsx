import "./Resumen.css"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import TotalDetail from "./components/total-detail/TotalDetail"
import { Button } from "src/shared/components/forms"
import { useIVA } from "src/shared/hooks/useIVA"
import { getDateStringMDY } from "src/utils/date"
import { times } from "src/shared/helpers/calculator"
import { TicketAbonar, TicketItemPayment } from "../Ticket"
import { capitalize } from "src/shared/helpers/capitalize"
import { LovePoint } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards.types"
import { TicketPaymentEdit } from "src/shared/sections/ticket/Ticket.sections"

const Resumen = ({
    disabled,
    labels,
    costos,
    aux,
    onEditMixto,
    lovePointsAmount,
    reservaSaved,
}: {
    disabled: boolean
    labels: {
        origen?: string
        codigo?: string
        fechasEstancia?: Date[]
        tipoHabitacion?: string
        tipoTarifa?: string
        personas?: number
        personasExtra?: number
        serviciosAdicionales?: string
        clientName?: string
        correo?: string
        telefono?: string
        experiencias?: { value: number; label: string }[]
    }
    aux: {
        numNoches?: number
    }
    costos: {
        estancia?: number
        personasExtra?: number
        experiencias?: number
        total?: number
    }
    lovePointsAmount: LovePoint | null
    onEditMixto: () => void
    reservaSaved?: {
        reservaIdSaved?: string
        folioSaved?: number
        pagosTotalSaved?: number
        pagosSaved?: number
        totalSaved?: number
    }
}) => {
    const { getIVA } = useIVA()

    const origen = () => {
        let label = "OTA"
        if (
            labels.origen === "recepcion" ||
            labels.origen === "telefono" ||
            labels.origen === "email" ||
            labels.origen === "otros"
        ) {
            label = ""
        }
        return label
    }

    const costoTotalEdit =
        reservaSaved?.pagosTotalSaved && costos.total ? costos.total - reservaSaved?.pagosTotalSaved : 0
    return (
        <div className="guest-resumen__wrapper">
            <div className="guest-resumen__header">
                <span className="guest-resumen__title">Resumen</span>
            </div>
            <div className="guest-resumen__body">
                {!!labels.codigo && (
                    <DescriptionDetail
                        darkMode
                        icon="bookMark"
                        label={"Código de reserva " + origen()}
                        value={`${capitalize(labels.origen || "")} - ${labels.codigo}`}
                        style={{ paddingBottom: "12px", paddingLeft: "12px", paddingRight: "12px" }}
                    />
                )}
                <DescriptionDetail
                    darkMode
                    icon="calendarFill"
                    label="Estancia"
                    value={`${getDateStringMDY(labels.fechasEstancia?.[0] || new Date())} - ${getDateStringMDY(
                        labels.fechasEstancia?.[1] || new Date()
                    )}`}
                    style={{ marginBottom: "12px", paddingLeft: "12px", paddingRight: "12px" }}
                />
                <DescriptionDetail
                    darkMode
                    icon="building4Fill"
                    label="Tipo de habitación"
                    value={labels.tipoHabitacion || ""}
                    style={{ marginBottom: "12px", paddingLeft: "12px", paddingRight: "12px" }}
                />
                <DescriptionDetail
                    darkMode
                    icon="dollarCircle"
                    label="Tipo de tarifa"
                    value={`${labels.tipoTarifa}`}
                    style={{ marginBottom: "12px", paddingLeft: "12px", paddingRight: "12px" }}
                />
                <DescriptionDetail
                    darkMode
                    icon="UserThinFilled"
                    label="Personas"
                    value={String(labels.personas || 0)}
                    style={{ marginBottom: "12px", paddingLeft: "12px", paddingRight: "12px" }}
                />
                {!!labels.personasExtra && (
                    <DescriptionDetail
                        darkMode
                        icon="userFilled"
                        label="Personas extra"
                        value={String(labels.personasExtra || 0)}
                        style={{ marginBottom: "12px", paddingLeft: "12px", paddingRight: "12px" }}
                    />
                )}
                {!!labels.serviciosAdicionales && (
                    <DescriptionDetail
                        darkMode
                        icon="star"
                        label="Servicios adicionales"
                        value={String(labels.serviciosAdicionales || "")}
                        style={{ marginBottom: "12px", paddingLeft: "12px", paddingRight: "12px" }}
                    />
                )}
                {!!labels.clientName && !reservaSaved?.reservaIdSaved && (
                    <>
                        <div className="guest-resumen__divider"></div>
                        <DescriptionDetail
                            darkMode
                            icon="userFilled"
                            label="Nombre completo"
                            value={labels.clientName || ""}
                            style={{ padding: "12px" }}
                        />
                    </>
                )}
                {labels.telefono && !reservaSaved?.reservaIdSaved && (
                    <DescriptionDetail
                        darkMode
                        icon="phone"
                        label="Teléfono"
                        value={labels.telefono || ""}
                        style={{ marginBottom: "12px", paddingLeft: "12px", paddingRight: "12px" }}
                    />
                )}
                {labels.correo && !reservaSaved?.reservaIdSaved && (
                    <DescriptionDetail
                        darkMode
                        icon="mailOpenFill"
                        label="Correo"
                        value={labels.correo || ""}
                        style={{ marginBottom: "12px", paddingLeft: "12px", paddingRight: "12px" }}
                    />
                )}

                {reservaSaved?.reservaIdSaved && (
                    <>
                        <div className="guest-resumen__divider" style={{ marginBottom: "12px" }}></div>
                        <span className="guest-resumen__title-pagos-registrados" style={{ marginBottom: "12px" }}>
                            Pagos registrados
                        </span>
                        <TicketPaymentEdit pagos={reservaSaved?.pagosSaved} applyCustomFormat={true} />
                    </>
                )}

                <TicketItemPayment onClick={onEditMixto} experiencias={0} />
                <TicketAbonar lovePointsAmount={lovePointsAmount} />

                <div className="guest-resumen__divider"></div>
            </div>

            <div className="guest-resumen__footer">
                <TotalDetail
                    label={`Estancia (${aux.numNoches || 1} noche${(aux.numNoches || 1) > 1 ? "s" : ""})`}
                    value={costos.estancia || 0}
                />
                {!!labels.personasExtra && (
                    <TotalDetail
                        label={`Personas extra  (${aux.numNoches || 1} noche${(aux.numNoches || 1) > 1 ? "s" : ""})`}
                        value={times(costos.personasExtra || 0, aux.numNoches || 0)}
                    />
                )}
                {!!labels.experiencias && labels.experiencias.length > 0 && (
                    <>
                        <TotalDetail
                            label={`Experiencias (${labels.experiencias.length})`}
                            value={costos.experiencias || 0}
                        />
                    </>
                )}

                <TotalDetail label="Impuestos" value={getIVA(costos.total || 0)} type="thin" />
                {reservaSaved?.reservaIdSaved && reservaSaved && (
                    <>
                        <TotalDetail label={"Total de reserva"} value={costos.total || 0} type="normal" />
                        <TotalDetail
                            label={"Total pagado"}
                            value={reservaSaved.pagosTotalSaved || 0}
                            type="normal"
                            style={{ margin: "12px 0" }}
                            signo={true}
                        />
                    </>
                )}
                <TotalDetail
                    label={reservaSaved?.reservaIdSaved ? "Por Pagar" : "Total"}
                    value={reservaSaved?.reservaIdSaved ? costoTotalEdit : costos.total || 0}
                    type="total"
                    style={{ margin: "12px 0" }}
                />
                <div className="guest-resumen__action">
                    <div className="guest-resumen__divider"></div>
                    <div className="guest-resumen__action__button__container">
                        {/* el botón dispara el evento en el formulario de la página guest */}
                        {reservaSaved?.reservaIdSaved ? (
                            <Button
                                text="Editar reserva"
                                className="guest-resumen__action__button"
                                type="submit"
                                disabled={disabled}
                            />
                        ) : (
                            <Button
                                text="Registrar reserva"
                                className="guest-resumen__action__button"
                                type="submit"
                                disabled={disabled}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Resumen
