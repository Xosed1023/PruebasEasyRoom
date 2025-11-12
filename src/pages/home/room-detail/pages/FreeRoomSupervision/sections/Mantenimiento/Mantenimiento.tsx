import { useEffect } from "react"
import { Puestos } from "src/constants/puestos"
import { useColaborador } from "src/pages/home/room-detail/hooks/colaborador"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { Controller, useForm } from "react-hook-form"
import useSubmitEvent from "../../hooks/useSubmitEvent"
import { TextBox } from "src/shared/components/forms"
import { useSelectedRoom } from "src/pages/home/room-detail/hooks/selected"
import { Estados_Habitaciones, TiposTarea, useCambiarTareaConEstadoMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import useSnackbar from "src/shared/hooks/useSnackbar"
import useOnFinished from "../../hooks/useOnFinished"
import { usePuestos } from "src/pages/home/room-detail/hooks/usePuestos"
import { SectionProps } from "../../types/props.types"
import { useTiposMantenimientoContext } from "src/shared/providers/TiposMantenimientoProvider"

const SIN_COLABORADOR = "none"

interface DefaultValues {
    motivo_mantenimiento: string | null
    colaborador: string | null
    comentario: string | null
}

const defaultValues: DefaultValues = {
    colaborador: null,
    comentario: null,
    motivo_mantenimiento: null,
}

const Mantenimiento = ({ isSubmitLoading, setIsDataLoading, setIsSubmitLoading }: SectionProps) => {
    const { data: usersMantenimiento } = useColaborador(Puestos.MANTENIMIENTO)
    const room = useSelectedRoom()
    const { usuario_id } = useProfile()
    const { showSnackbar } = useSnackbar()
    const [cambiarTareaConEstado] = useCambiarTareaConEstadoMutation()
    const { onFinished } = useOnFinished({ onEnd: () => setIsSubmitLoading(false) })
    const puestos = usePuestos()
    const { tiposMantenimiento } = useTiposMantenimientoContext()
    useEffect(() => {
        if (!puestos) {
            setIsDataLoading(true)
            return
        }
        setIsDataLoading(false)
    }, [puestos])

    const puesto_id = puestos?.find((i) => i?.nombre === Puestos.MANTENIMIENTO)?.puesto_id || ""

    const { handleSubmit, control } = useForm({ defaultValues })

    const onSubmit = async (v: DefaultValues) => {
        if (isSubmitLoading) {
            return
        }
        setIsSubmitLoading(true)
        try {
            const colaborador = usersMantenimiento.find(({ colaborador_id }) => colaborador_id === v.colaborador)
            const colaborador_ids = !v.colaborador || v.colaborador === SIN_COLABORADOR ? [] : [v.colaborador]

            const description = `Mantenimiento de la habitación ${room?.nombre}`
            await cambiarTareaConEstado({
                variables: {
                    switch_task_with_room_state_input: {
                        tarea_id: room?.colaborador_tareas_sin_finalizar?.[0]?.tarea_id,
                        colaborador_id: colaborador_ids,
                        colaborador_tarea_id: room?.colaborador_tareas_sin_finalizar?.map(
                            (c) => c?.colaborador_tarea_id
                        ),
                        habitacion_id: room?.habitacion_id,
                        estado_habitacion: Estados_Habitaciones.Mantenimiento,
                        tarea: {
                            nombre: description,
                            descripcion: v.motivo_mantenimiento || "",
                            puesto_id: puesto_id || colaborador?.puesto_id || "",
                            tipo: TiposTarea.Mantenimiento,
                        },
                        usuario_id,
                        ...(v.comentario
                            ? {
                                comentarios: [
                                    {
                                        usuario_id,
                                        comentario: v.comentario,
                                        fecha: new Date().toISOString(),
                                    },
                                ],
                            }
                            : {}),
                    },
                },
            })
            const text = !colaborador?.nombre
                ? `El estado de la habitación **${room?.nombre}** fue actualizado a mantenimiento.`
                : `**${colaborador?.nombre}** comenzará con el mantenimiento de la habitación **${room?.nombre}.**`
            showSnackbar({
                title: "Habitación en mantenimiento",
                text,
                status: "success",
            })
            onFinished()
        } catch (e) {
            showSnackbar({
                title: "Error al asignar personal a mantenimiento",
                status: "error",
            })
            console.log(e)
        } finally {
            setIsSubmitLoading(false)
        }
    }

    useSubmitEvent({ onEvent: handleSubmit(onSubmit) })

    return (
        <form className="free-room-supervisor__select">
            <Controller
                control={control}
                name={"motivo_mantenimiento"}
                rules={{ required: true }}
                render={({ field: { value, onChange }, formState: { errors } }) => (
                    <Dropdown
                        value={value || ""}
                        onClick={(e) => {
                            onChange(e.value)
                        }}
                        label="Motivo de mantenimiento"
                        placeholder="Selecciona un motivo"
                        icon="tools"
                        options={tiposMantenimiento.map((m) => {
                            return {
                                label: m.nombre,
                                value: m.nombre,
                            }
                        })}
                        iconInOptions={false}
                        errorHintText={errors.motivo_mantenimiento ? "Selecciona un motivo" : ""}
                    />
                )}
            />
            <Controller
                control={control}
                name={"colaborador"}
                rules={{ required: true }}
                render={({ field: { value, onChange }, formState: { errors } }) => (
                    <Dropdown
                        value={value || ""}
                        onClick={(e) => {
                            onChange(e.value)
                        }}
                        label="Personal disponible"
                        placeholder="Selecciona una opción"
                        icon="userFilled"
                        options={[
                            ...usersMantenimiento.map(({ nombre, colaborador_id }) => {
                                return {
                                    label: nombre,
                                    value: colaborador_id,
                                }
                            }),
                            {
                                label: "Omitir asignación de personal",
                                value: SIN_COLABORADOR,
                            },
                        ]}
                        iconInOptions={false}
                        errorHintText={errors.colaborador ? "Selecciona un personal" : ""}
                    />
                )}
            />
            <Controller
                control={control}
                name={"comentario"}
                rules={{ required: false, maxLength: 80 }}
                render={({ field: { value, onChange }, formState: { errors } }) => (
                    <div className="free-room-supervisor__select">
                        <TextBox
                            description="Comentarios"
                            className="comment__textarea"
                            placeholder="Escribe un comentario..."
                            value={value || ""}
                            onChange={onChange}
                            characterLimit={80}
                            error={!!errors.comentario}
                            errorHintText={errors.comentario ? "El comentario es opcional" : ""}
                        />
                    </div>
                )}
            />
        </form>
    )
}

export default Mantenimiento
