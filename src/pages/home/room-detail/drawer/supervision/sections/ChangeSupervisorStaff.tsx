import { useState } from "react"
import { ListView } from "../../../sections/views/Views"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { Block, PrimaryButton } from "../../../sections/elements/Elements"
import { useRoom } from "../../../hooks"
import { State } from "../../general/index.type"
import { Puestos } from "src/constants/puestos"
import { EmptyColaborador } from "../../general/sections/Empty"
import profileDefault from "src/assets/webp/profile_default.webp"
import { useColaborador } from "../../../hooks/colaborador"
import { useCambiarTareaEntreColaboradoresMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { useCloseDrawer } from "../../../helpers/useCloseDrawer"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { usePuestos } from "../../../hooks/usePuestos"
import { getName } from "src/pages/propinas/home/helpers/name"
import "./../../pendiente-supervision/sections/SupervisorStaff.css"

const SIN_COLABORADOR = "none"

const ChangeSupervisor = () => {
    const [selected, setValue] = useState<State>({ label: "", value: "", extra: "" })

    const puestos = usePuestos()
    const puesto_id = puestos?.find((i) => i?.nombre === Puestos.SUPERVISOR)?.puesto_id || ""

    const [cambiarTareaEntreColaboradores] = useCambiarTareaEntreColaboradoresMutation()

    const room = useRoom()
    const { showMiniSnackbar } = useMiniSnackbar()
    const { usuario_id, turno_hotel_id, hotel_id } = useProfile()
    const { data: camaristas, load: loadingCamaristas } = useColaborador(Puestos.RECAMARISTA)
    const { data: supervisores, load: loadingSupervisores } = useColaborador(Puestos.SUPERVISOR, Puestos.SUPERVISOR)
    const [isConfirmAsignarSupervisorLoading, setisConfirmAsignarSupervisorLoading] = useState(false)

    const tarea = room?.colaborador_tareas_sin_finalizar?.[0]

    const { closeDrawer } = useCloseDrawer(() => {
        setisConfirmAsignarSupervisorLoading(false)
    })

    const handleConfirm = async () => {
        if (isConfirmAsignarSupervisorLoading) {
            return
        }
        if (selected.value && selected.extra) {
            setisConfirmAsignarSupervisorLoading(true)
            const colaborador_ids = !selected.value || selected.value === SIN_COLABORADOR ? [] : [selected.value]
            cambiarTareaEntreColaboradores({
                variables: {
                    switch_task_btw_colab_input: {
                        sin_personal_asignado: !colaborador_ids.length,
                        tarea_id: tarea?.tarea_id,
                        hotel_id,
                        colaborador_id: colaborador_ids,
                        colaborador_tarea_id: [tarea?.colaborador_tarea_id],
                        descripcion_tarea: tarea?.descripcion_tarea,
                        habitacion_id: room?.habitacion_id,
                        tarea: {
                            descripcion: tarea?.descripcion_tarea,
                            nombre: tarea?.descripcion_tarea,
                            puesto_id:
                                tarea?.colaborador?.colaborador_in_hotel?.[0]?.puesto?.puesto_id ||
                                selected.extra ||
                                puesto_id ||
                                "",
                        },
                        turno_id: turno_hotel_id,
                        usuario_id,
                    },
                },
            })
                .then(({ data }) => {
                    showMiniSnackbar({
                        title: "Cambio de supervisora",
                        text: `Cambiaste a ${getName(tarea?.colaborador)} por ${
                            selected.label
                        } continuará con la supervisión de la habitación ${room?.nombre}.`,
                        status: "success",
                    })
                })
                .catch((e) => {
                    showMiniSnackbar({
                        title: "Error al reasignar personal de supervisiòn",
                        status: "error",
                    })
                    console.log(e)
                })
                .finally(() => {
                    closeDrawer()
                })
        }
    }

    return (
        <ListView
            title={"Reasignación de personal para supervisión"}
            subtitle={"Supervisoras disponibles"}
            titleStyle={{ width: "100%", maxWidth: "100%" }}
            subtitleStyle={{ fontWeight: 400 }}
        >
            {!loadingCamaristas && !loadingSupervisores ? (
                (camaristas?.length || 0) > 0 || (supervisores.length || 0) > 0 ? (
                    <div className="detalle-h-general__supervision__box">
                        <Block
                            list
                            scroll
                            className="detalle-h--pendiente-supervision-supervisor-list"
                            style={{ height: "calc(100dvh - 340px)" }}
                        >
                            {[...camaristas, ...supervisores]
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
                        <PrimaryButton
                            disabled={!selected.value}
                            text="Asignar a supervisión"
                            onClick={handleConfirm}
                        />
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

export default ChangeSupervisor
