import React from "react"
import { ListView } from "../../../sections/views/Views"
import { useRoom } from "../../../hooks"
import { Block, PrimaryButton, SecondaryButton } from "../../../sections/elements/Elements"
import profileDefault from "src/assets/webp/profile_default.webp"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { selectCleaningSection } from "src/store/roomDetails/cleaningSlice"
import { formatTimeAgo } from "src/utils/timeago"

const ActiveCleanStaff = () => {
    const room = useRoom()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    return (
        <ListView
            title="Personal de limpieza activo"
            subtitleStyle={{ fontWeight: 400 }}
        >
            <div className="detalle-h-general__mantenance__box">
                <Block list scroll className="detalle-h-general__block-active__staff animante__opacity-transform__ease">
                    {room?.colaborador_tareas_sin_finalizar?.map(
                        ({
                            colaborador_id = "",
                            colaborador: { nombre = "", apellido_materno = "", apellido_paterno = "", foto = "" },
                            fecha_inicio,
                        }) => (
                            <CardStaff
                                key={colaborador_id}
                                name={`${nombre} ${apellido_paterno} ${apellido_materno}`}
                                description={`En limpieza desde hace: **${
                                    fecha_inicio ? formatTimeAgo(fecha_inicio).split("Hace ")[1] : "-"
                                }**`}
                                picture={foto || profileDefault}
                                active={false}
                            />
                        )
                    )}
                </Block>
                <PrimaryButton
                    text={"Finalizar limpieza"}
                    style={{ marginBottom: 12 }}
                    onClick={() => navigate(`/u/detalle-habitacion/finish-clean/${room?.habitacion_id}`)}
                />
                <SecondaryButton
                    text={"Cambiar o agregar camarista"}
                    onClick={() => dispatch(selectCleaningSection("clean-staff"))}
                />
            </div>
        </ListView>
    )
}

export default ActiveCleanStaff
