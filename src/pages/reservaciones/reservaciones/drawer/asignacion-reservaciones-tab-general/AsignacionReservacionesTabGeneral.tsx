import React from "react"
import { GetReservacionesTableQuery } from "src/gql/schema"
import { getOrigenLabel } from "src/pages/reservaciones/helpers/origen"
import { CancelButton } from "src/pages/reservaciones/inicio/components/CancelButton/CancelButton"
import { Comments } from "src/pages/reservaciones/inicio/components/Comments/Comments"
import Description from "src/shared/components/data-display/description/Description"
import { Button } from "src/shared/components/forms"
import { formatDateShort } from "src/shared/hooks/formatDate-mm-dd-yy"

const AsignacionReservacionesTabGeneral = ({
    sentReservaD,
}: {
    sentReservaD: GetReservacionesTableQuery["reservas"][0]
}) => {
    return (
        <div>
            <div className="reservas-screen__drawer__description">
                <Description
                    icon={"calendar01"}
                    label1={"Fecha de reservación"}
                    value1={`${sentReservaD.fecha_entrada && formatDateShort(new Date(sentReservaD.fecha_entrada))} - ${
                        sentReservaD.fecha_entrada && formatDateShort(new Date(sentReservaD.fecha_salida))
                    }`}
                />
                <Description
                    icon={"building"}
                    label1={"Tipo de habitación"}
                    value1={`#${sentReservaD.habitacion?.numero_habitacion || ""}`}
                />
                {/*TODO:FIX  query */}
                <Description
                    icon={"building"}
                    label1={"Origen de reserva"}
                    value1={sentReservaD?.origen ? getOrigenLabel(sentReservaD?.origen) : ""}
                />
                <Description
                    icon={"biling"}
                    label1={"Tarifa"}
                    value1={"Normal"}
                    value2={sentReservaD.tarifa?.nombre || ""}
                />

                <Description
                    icon={"building"}
                    label1={"Habitacion"}
                    value1={sentReservaD.habitacion?.numero_habitacion || ""}
                />
                <Comments />
            </div>
            <Button
                className="reservas-screen__drawer__button"
                text={"Reasignar habitación"}
                onClick={() => {
                    1
                }}
            />

            <CancelButton
                id={sentReservaD.habitacion_id ? sentReservaD.habitacion_id : ""}
                codigo={sentReservaD.folio.toString() || ""}
                corteId={sentReservaD?.corte_id || ""}
            />
        </div>
    )
}

export default AsignacionReservacionesTabGeneral
