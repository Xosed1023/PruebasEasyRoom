import { Puestos } from "src/constants/puestos"
import MultipleSelectDropdown from "src/shared/components/forms/MultipleSelectDropdown/MultipleSelectDropdown"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"

import {
    Estados_Habitaciones,
    TiposLimpiezas,
    TiposTarea,
    useCambiarTareaConEstadoMutation,
    useGetHabitacionQuery,
} from "src/gql/schema"
import { useColaborador } from "src/pages/home/room-detail/hooks/colaborador"
import { Controller, useForm } from "react-hook-form"
import useSubmitEvent from "../../hooks/useSubmitEvent"
import { useSelectedRoom } from "src/pages/home/room-detail/hooks/selected"
import { useProfile } from "src/shared/hooks/useProfile"
import useSnackbar from "src/shared/hooks/useSnackbar"
import useOnFinished from "../../hooks/useOnFinished"
import { SectionProps } from "../../types/props.types"
import { useEffect } from "react"
import { TextBox } from "src/shared/components/forms"
import { useParams } from "react-router-dom"

export interface DefaultValues {
    tipoLimpieza: TiposLimpiezas | null
    colaborador:
        | {
              id: string
              puesto_id: string
              name: string
          }[]
        | null
    comentarios: string
}

const defaultValues: DefaultValues = {
    colaborador: null,
    tipoLimpieza: TiposLimpiezas.Retoque,
    comentarios: "",
}

const Limpieza = ({ isSubmitLoading, setIsDataLoading, setIsSubmitLoading, showComments }: SectionProps) => {
    const { data: recamaristas } = useColaborador([Puestos.RECAMARISTA], Puestos.RECAMARISTA)
    const [cambiarTareaConEstado] = useCambiarTareaConEstadoMutation()
    const room = useSelectedRoom()
    const { usuario_id, hotel_id } = useProfile()
    const { showSnackbar } = useSnackbar()
    const { onFinished } = useOnFinished({ onEnd: () => setIsSubmitLoading(false) })

    const { handleSubmit, control, setValue } = useForm({
        defaultValues,
    })

    const { habitacion_id = "" } = useParams()

    const { data } = useGetHabitacionQuery({
        variables: {
            habitacion_id,
            usuario_id,
            hotel_id
        },
        skip: !habitacion_id || !usuario_id,
    })

    useEffect(() => {
        const ultimas = data?.habitacion?.ultimos_datos?.ultima_limpieza
        if (!ultimas || ultimas.length === 0) return

        const colaboradores = [...(recamaristas || [])]

        const matches = ultimas.flatMap((limpieza) => {
            const match = colaboradores.find((colaborador) => colaborador.colaborador_id === limpieza.colaborador_id)
            return match ? [match] : []
        })

        if (matches.length > 0) {
            setValue(
                "colaborador",
                matches.map((match) => ({
                    id: match.colaborador_id,
                    name: match.nombre,
                    puesto_id: match.puesto_id || "",
                }))
            )
        }
    }, [data?.habitacion?.ultimos_datos?.ultima_limpieza, recamaristas, setValue])

    useEffect(() => {
        if (!recamaristas.length) {
            setIsDataLoading(true)
            return
        }
        setIsDataLoading(false)
    }, [recamaristas])

    const onSubmit = async (v: DefaultValues) => {
        if (isSubmitLoading) {
            return
        }
        setIsSubmitLoading(true)
        try {
            const description = `Limpieza de la habitación ${room?.nombre}`
            await cambiarTareaConEstado({
                variables: {
                    switch_task_with_room_state_input: {
                        hotel_id,
                        tarea_id: room?.colaborador_tareas_sin_finalizar?.[0]?.tarea_id,
                        colaborador_id: v.colaborador?.map((c) => c.id),
                        colaborador_tarea_id: room?.colaborador_tareas_sin_finalizar?.map(
                            (c) => c?.colaborador_tarea_id
                        ),
                        habitacion_id: room?.habitacion_id,
                        estado_habitacion: Estados_Habitaciones.Limpieza,
                        tarea: {
                            nombre: description,
                            descripcion: description,
                            puesto_id: v.colaborador?.[0].puesto_id || "",
                            tipo: TiposTarea.Limpieza,
                        },
                        usuario_id,
                        tipo_limpieza: v.tipoLimpieza,
                        comentarios: [
                            {
                                usuario_id,
                                comentario: v.comentarios,
                                fecha: new Date().toISOString(),
                            },
                        ],
                    },
                },
            })
            showSnackbar({
                status: "success",
                title: `Limpieza de habitación ${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}`,
                text: `**${v.colaborador?.[0].name}** comenzará con la **limpieza ${
                    v.tipoLimpieza === "normal"
                        ? "normal de 30 min"
                        : v.tipoLimpieza === "detallada"
                        ? "detallada de 60 min"
                        : v.tipoLimpieza === "retoque"
                        ? "retoque de 15 min"
                        : ""
                }** en la habitación **${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}.**`,
            })
            onFinished()
        } catch (e) {
            showSnackbar({
                title: "Error al asignar personal a limpieza",
                status: "error",
            })
            console.log(e)
        } finally {
            setIsSubmitLoading(false)
        }
    }

    useSubmitEvent({ onEvent: handleSubmit(onSubmit) })

    return (
        <form className="end-checkout__dropdown__container">
            <Controller
                control={control}
                name={"colaborador"}
                rules={{ required: true }}
                render={({ field: { value, onChange }, formState: { errors } }) => (
                    <MultipleSelectDropdown<{ id: string; puesto_id: string; name: string }>
                        editable={true}
                        icon="userFilled"
                        containerStyle={{
                            width: "435px",
                        }}
                        maxSelections={4}
                        containerClassName="end-checkout--cleaning__dropdown"
                        errorHintText={errors.colaborador ? "Selecciona una camarista" : undefined}
                        value={value || []}
                        label="Camaristas disponibles"
                        placeholder="Selecciona una opción"
                        onChange={onChange}
                        options={[
                            ...(recamaristas?.map((r) => ({
                                id: r.colaborador_id,
                                withCheckbox: true,
                                withPhoto: true,
                                value: {
                                    id: r.colaborador_id,
                                    puesto_id: r.puesto_id || "",
                                    name: r.nombre,
                                },
                                label: `${r.nombre} `,
                                photoSrc: r.foto,
                            })) || []),
                        ]}
                        allowDeselectWhenMax={true}
                    />
                )}
            />
            <Controller
                control={control}
                name={"tipoLimpieza"}
                rules={{ required: true }}
                render={({ field: { value, onChange }, formState: { errors } }) => (
                    <Dropdown
                        icon="broom"
                        className="end-checkout--cleaning__dropdown"
                        errorHintText={errors.tipoLimpieza ? "Selecciona un tipo de limpieza" : undefined}
                        value={value || ""}
                        label="Tipo de limpieza"
                        placeholder="Selecciona una opción"
                        onClick={(e) => onChange(e.value)}
                        options={[
                            { label: "Normal", value: "normal" },
                            { label: "Detallada", value: "detallada" },
                            { label: "Retoque", value: "retoque" },
                        ]}
                    />
                )}
            />
            {showComments && (
                <Controller
                    name={"comentarios"}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value }, formState: { errors } }) => (
                        <TextBox
                            placeholder="Escribe un comentario..."
                            style={{ width: "100%" }}
                            onChange={(value) => onChange(value)}
                            value={value}
                            error={!!errors?.comentarios}
                            description="Comentarios"
                            errorHintText={errors?.comentarios ? "Ingresa un comentario" : ""}
                        />
                    )}
                />
            )}
        </form>
    )
}

export default Limpieza
