import { useEffect, useState } from "react"
import { ListView } from "../../../sections/views/Views"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import useSnackbar from "src/shared/hooks/useSnackbar"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { Block, PrimaryButton } from "../../../sections/elements/Elements"
import { useColaborador } from "../../../hooks/colaborador"
import { useRoom } from "../../../hooks"
import { SectionProps } from "../../general/index.type"
import { Puestos } from "src/constants/puestos"
import { useCambiarTareaEntreColaboradoresMutation } from "src/gql/schema"
import { useDispatch } from "react-redux"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { selectRoom } from "src/store/rooms/roomsSlice"
import { useProfile } from "src/shared/hooks/useProfile"
import profileDefault from "src/assets/webp/profile_default.webp"
import useLoadingState from "src/shared/hooks/useLoadingState"
import LoaderComponent from "src/shared/components/layout/loader/Loader"

const CleanStaff = ({ onNavigate }: SectionProps) => {
    const room = useRoom()

    const { data: camaristas } = useColaborador(Puestos.RECAMARISTA, Puestos.RECAMARISTA)

    const { isLoading, isLoadingDelayed, toggleIsLoading } = useLoadingState()
    const { showMiniSnackbar } = useMiniSnackbar()
    const { showSnackbar } = useSnackbar()
    const { usuario_id, turno_hotel_id } = useProfile()
    const dispatch = useDispatch()
    const [cambiarTareaEntreColaboradores] = useCambiarTareaEntreColaboradoresMutation()

    const [colaboradoresSelected, setColaboradoresSelected] = useState<{ nombre: string; colaborador_id: string }[]>([])

    useEffect(() => {
        setColaboradoresSelected(
            room?.colaborador_tareas_sin_finalizar?.map((c) => ({
                colaborador_id: c.colaborador_id,
                nombre: `${c?.colaborador?.nombre} ${c?.colaborador?.apellido_paterno} ${c?.colaborador?.apellido_materno}`,
            }))
        )
    }, [])

    const handleConfirm = () => {
        // Si quiero agregar personas a la tarea
        const colaborador_ids = colaboradoresSelected?.filter(
            (c) => !room?.colaborador_tareas_sin_finalizar?.some((ct) => c.colaborador_id === ct?.colaborador_id)
        )

        // Tareas id de las personas que se van a quitar de la tarea
        const colaborador_tareas_ids = room?.colaborador_tareas_sin_finalizar?.filter(
            (c) => !colaboradoresSelected?.some((ct) => c.colaborador_id === ct?.colaborador_id)
        )

        const tipoLimpieza = room?.colaborador_tareas_sin_finalizar?.[0]?.tipo_limpieza

        const puestoId =
            room?.colaborador_tareas_sin_finalizar?.[0]?.colaborador?.colaborador_in_hotel?.[0]?.puesto?.puesto_id

        if (isLoading && colaboradoresSelected.length) {
            return
        }
        toggleIsLoading({ value: true })
        cambiarTareaEntreColaboradores({
            variables: {
                switch_task_btw_colab_input: {
                    sin_personal_asignado: false,
                    tarea_id: room?.colaborador_tareas_sin_finalizar?.[0]?.tarea_id,
                    colaborador_id: colaborador_ids.map((c) => c.colaborador_id),
                    colaborador_tarea_id: colaborador_tareas_ids?.map((c) => c.colaborador_tarea_id),
                    descripcion_tarea: `Limpieza de la habitacion ${room?.nombre}`,
                    habitacion_id: room?.habitacion_id,
                    tarea: {
                        descripcion: `Limpieza de la habitacion ${room?.nombre}`,
                        nombre: `Limpieza de la habitacion ${room?.nombre}`,
                        puesto_id: puestoId,
                    },
                    tipo_limpieza: tipoLimpieza,
                    turno_id: turno_hotel_id,
                    usuario_id,
                },
            },
        })
            .then(({ data }) => {
                const nombresColaboradoresSelected = colaboradoresSelected.map((c) => `**${c.nombre}**`).join(", ")
                const colaboradoresAsignados = room?.colaborador_tareas_sin_finalizar || []
                const nombresAsignados = colaboradoresAsignados
                    .map((ct) => {
                        const c = ct.colaborador
                        return `**${c.nombre} ${c.apellido_paterno} ${c.apellido_materno}**`
                    })
                    .join(", ")
                showSnackbar({
                    title: "Cambio de camarista",
                    text: `Cambiaste a ${nombresColaboradoresSelected} por ${nombresAsignados} ${
                        colaboradoresAsignados.length > 1 ? "continuarán" : "continuará"
                    } con la limpieza de la habitación **${room?.nombre}**`,
                    status: "success",
                })
                dispatch(toggleRoomDetailsDrawer(false))
                dispatch(selectRoom({}))
                onNavigate("home")
            })
            .catch((e) => {
                showMiniSnackbar({
                    title: "Error al reasignar camarista",
                    status: "error",
                })
                console.log(e)
            })
            .finally(() => {
                toggleIsLoading({ value: false })
            })
    }

    const allColaboradores = [...(camaristas || [])]
    return (
        <ListView
            title="Reasignación de camarista para limpieza"
            subtitle="Camaristas disponibles"
            subtitleStyle={{ fontWeight: 400 }}
        >
            <div className="detalle-h-general__mantenance__box">
                <Block list scroll className="detalle-h-general__block-mg animante__opacity-transform__ease">
                    {room?.colaborador_tareas_sin_finalizar?.map(
                        ({ colaborador_id = "", colaborador: { nombre = "", foto = "" } }) => (
                            <CardStaff
                                key={colaborador_id}
                                name={nombre}
                                disabled={
                                    colaboradoresSelected.length >= 4 &&
                                    !colaboradoresSelected.some((c) => c.colaborador_id === colaborador_id)
                                }
                                description={`Disponible desde hace: -`}
                                text={`Última habitación asignada: ${room?.nombre}`}
                                picture={foto || profileDefault}
                                active={colaboradoresSelected.some((c) => c.colaborador_id === colaborador_id)}
                                onClick={() => {
                                    if (colaboradoresSelected.find((c) => c.colaborador_id === colaborador_id)) {
                                        setColaboradoresSelected((colabs) =>
                                            colabs.filter((c) => c.colaborador_id !== colaborador_id)
                                        )
                                        return
                                    }
                                    if (colaboradoresSelected.length >= 4) {
                                        return
                                    }
                                    const camarista = { nombre, colaborador_id }
                                    setColaboradoresSelected((c) => [...c, camarista])
                                }}
                            />
                        )
                    )}
                    {allColaboradores?.map(
                        (
                            {
                                nombre = "",
                                colaborador_id = "",
                                ultima_habitacion = "",
                                tiempo_disponible = "",
                                foto = "",
                            },
                            index
                        ) => {
                            return (
                                <CardStaff
                                    key={index}
                                    name={nombre}
                                    disabled={
                                        colaboradoresSelected.length >= 4 &&
                                        !colaboradoresSelected.some((c) => c.colaborador_id === colaborador_id)
                                    }
                                    description={`Disponible desde hace: ${tiempo_disponible}`}
                                    text={`Última habitación asignada: ${ultima_habitacion}`}
                                    picture={foto || profileDefault}
                                    active={colaboradoresSelected.some((c) => c.colaborador_id === colaborador_id)}
                                    onClick={() => {
                                        if (colaboradoresSelected.find((c) => c.colaborador_id === colaborador_id)) {
                                            setColaboradoresSelected((colabs) =>
                                                colabs.filter((c) => c.colaborador_id !== colaborador_id)
                                            )
                                            return
                                        }
                                        if (colaboradoresSelected.length >= 4) {
                                            return
                                        }
                                        const colaborador = { nombre, colaborador_id }
                                        setColaboradoresSelected((c) => [...c, colaborador])
                                    }}
                                />
                            )
                        }
                    )}
                </Block>
                <PrimaryButton
                    text="Asignar a limpieza"
                    onClick={handleConfirm}
                    disabled={isLoadingDelayed || !colaboradoresSelected.length}
                />
            </div>
            <LoaderComponent visible={isLoading} />
        </ListView>
    )
}

export default CleanStaff
