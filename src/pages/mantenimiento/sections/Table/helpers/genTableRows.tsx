import React from "react"
import { EstatusCorte, Mantenimiento } from "src/gql/schema"
import Icon from "src/shared/icons"
import Dot from "src/shared/icons/Dot"
import { getFormatLongDateHour } from "src/utils/date"
import { EnergeticoData } from "../Table"

const genTableRows = ({
    mantenimientos,
    onEdit,
}: {
    mantenimientos: Mantenimiento[]
    onEdit: (data: EnergeticoData) => void
}) => {
    return (
        mantenimientos.map(
            ({
                agua,
                gas,
                luz,
                mantenimiento_id,
                colaborador_id,
                colaborador: { nombre, apellido_paterno, apellido_materno },
                corte: { folio, estatus },
                turno: { nombre: nombreTurno },
                fecha_registro,
            }) => ({
                value: [
                    {
                        value:
                            estatus === EstatusCorte.Cerrado ? (
                                folio.toString().padStart(4, "0")
                            ) : (
                                <div>
                                    Pendiente <Dot color="var(--ocupado)" width={8} height={8} />
                                </div>
                            ),
                    },
                    { value: nombreTurno },
                    { value: getFormatLongDateHour(fecha_registro) },
                    { value: `${agua} L` },
                    { value: `${gas} L` },
                    { value: `${luz} kW` },
                    { value: `${nombre} ${apellido_paterno}` },
                    {
                        value: (
                            <Icon
                                name="pencil"
                                width={16}
                                height={16}
                                color="var(--primary)"
                                onClick={() =>
                                    onEdit({
                                        agua,
                                        gas,
                                        luz,
                                        responsable: {
                                            id: colaborador_id,
                                            name: `${nombre} ${apellido_paterno} ${apellido_materno}`,
                                        },
                                        mantenimiento_id,
                                    })
                                }
                            />
                        ),
                    },
                ],
            })
        ) || []
    )
}

export default genTableRows
