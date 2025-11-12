import { useState } from "react"
import { ListView } from "../../../sections/views/Views"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { Block, PrimaryButton } from "../../../sections/elements/Elements"
import { useRoom } from "../../../hooks"
import { State } from "../../general/index.type"
import { assignColaborador } from "../../../helpers/colaborador"
import { Puestos } from "src/constants/puestos"
import { EmptyColaborador } from "../../general/sections/Empty"
import profileDefault from "src/assets/webp/profile_default.webp"

import "./SupervisorStaff.css"
import { useColaborador } from "../../../hooks/colaborador"
import { Estados_Habitaciones, TiposTarea } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { useCloseDrawer } from "../../../helpers/useCloseDrawer"
import LoaderComponent from "src/shared/components/layout/loader/Loader"

const CleanSupervisor = () => {
    const [selected, setValue] = useState<State>({ label: "", value: "", extra: "" })

    const room = useRoom()
    const { showMiniSnackbar } = useMiniSnackbar()
    const { usuario_id } = useProfile()
    const { data: supervisores, load: loadingSupervisores } = useColaborador(Puestos.SUPERVISOR, Puestos.SUPERVISOR)
    const [isConfirmAsignarSupervisorLoading, setisConfirmAsignarSupervisorLoading] = useState(false)

    const { closeDrawer } = useCloseDrawer(() => {
        setisConfirmAsignarSupervisorLoading(false)
    })

    const handleError = () => {
        showMiniSnackbar({
            title: "Error al asignar habitación a supervisión",
            status: "error",
        })
    }

    const handleConfirm = async () => {
        if (isConfirmAsignarSupervisorLoading) {
            return
        }
        if (selected.value && selected.extra) {
            setisConfirmAsignarSupervisorLoading(true)
            const descripcion = `Supervisión de la habitación ${room?.nombre}`
            try {
                await assignColaborador({
                    datos_tarea: {
                        descripcion: descripcion,
                        nombre: "Supervisión de habitación",
                        puesto_id: selected.extra,
                        tipo: TiposTarea.Supervision,
                    },
                    datos_colaborador_tarea: {
                        colaborador_ids: [selected.value],
                        descripcion_tarea: descripcion,
                        habitacion_id: room?.habitacion_id,
                    },
                    usuario_id,
                    estadoHabitacion: Estados_Habitaciones.Supervision,
                })
                showMiniSnackbar({
                    title: "Habitación en supervisión",
                    text: `La **habitación ${room?.nombre}** está en **supervisión** por **${selected.label}.**`,
                    status: "success",
                })
            } catch (e) {
                handleError()
                console.log(e)
            } finally {
                closeDrawer()
            }
        }
    }

    return (
        <ListView
            title="Asigna un supervisor"
            subtitle="Personal disponible"
            titleStyle={{ width: "80%" }}
            subtitleStyle={{ fontWeight: 400 }}
        >
            {!loadingSupervisores ? (
                (supervisores.length || 0) > 0 ? (
                    <div className="detalle-h-general__supervision__box">
                        <Block list scroll className="detalle-h--pendiente-supervision-supervisor-list">
                            {[...supervisores]
                                ?.filter((c) => c.puesto === Puestos.RECAMARISTA || c.puesto === Puestos.SUPERVISOR)
                                ?.map((c, index) => (
                                    <CardStaff
                                        key={index}
                                        name={c.nombre}
                                        picture={c?.foto || profileDefault}
                                        onClick={() =>
                                            setValue({
                                                label: c.nombre,
                                                value: c.colaborador_id,
                                                extra: c.puesto_id || "",
                                            })
                                        }
                                        active={c.colaborador_id === selected.value}
                                    />
                                ))}
                        </Block>
                        <PrimaryButton disabled={!selected.value} text="Asignar supervisor" onClick={handleConfirm} />
                    </div>
                ) : (
                    <EmptyColaborador
                        title="Sin personal de supervisión disponible"
                        className="detalle-h-general__supervision__box"
                    />
                )
            ) : null}
            <LoaderComponent visible={isConfirmAsignarSupervisorLoading} />
        </ListView>
    )
}

export default CleanSupervisor
