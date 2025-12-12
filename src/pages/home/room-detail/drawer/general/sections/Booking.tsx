import { useState } from "react"
import { ListView } from "../../../sections/views/Views"
import { useRoom, useRoomStore } from "../../../hooks"
import { Block, PrimaryButton, Title, TouchableBoldCard } from "../../../sections/elements/Elements"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { State } from "../index.type"
import { client } from "src/graphql"
import { ASIGNAR_HABITACION_A_RESERVA } from "src/pages/home/graphql/mutations/booking"
import { useProfile } from "src/shared/hooks/useProfile"
import { useRoomMethods } from "../../../hooks/methods"
import {
    Estados_Habitaciones,
    useActualizar_Colaboradores_TareasMutation,
    useGetReservasDelDiaSinAsignarQuery,
} from "src/gql/schema"

import "./Booking.css"

const Booking = ({ closePrevTask = false }: { closePrevTask?: boolean }) => {
    const [lvalue, setValue] = useState<State>({ label: "", value: "" })
    const { usuario_id, hotel_id } = useProfile()
    const room = useRoom()

    const [finalizarTarea] = useActualizar_Colaboradores_TareasMutation()
    const [fecha_entrada] = useState(new Date().toISOString())

    const { data } = useGetReservasDelDiaSinAsignarQuery({
        variables: {
            hotel_id,
            fecha_entrada,
        },
    })
    const { handleFinish } = useRoomStore()
    const { showMiniSnackbar } = useMiniSnackbar()
    const { updateStatus } = useRoomMethods()

    const handleError = () =>
        showMiniSnackbar({
            title: "Error al asignar la habitación a reserva",
            status: "error",
        })

    const handleConfirm = async () => {
        if (!lvalue.value) {
            return
        }
        const datos_reserva = {
            habitacion_id: room?.habitacion_id,
            reserva_id: lvalue.value,
            usuario_id,
        }
        if (closePrevTask) {
            const colaborador_tareas_sin_finalizar =
                room.colaborador_tarea?.colaborador_tareas_sin_finalizar?.map?.((c) => c?.colaborador_tarea_id) || []
            finalizarTarea({
                variables: {
                    datos_tarea: {
                        hotel_id,
                        colaboradores_tareas_ids: colaborador_tareas_sin_finalizar,
                        usuario_id,
                        estado: Estados_Habitaciones.Reservada,
                    },
                },
            })
                .then(() => {
                    client
                        .mutate({
                            mutation: ASIGNAR_HABITACION_A_RESERVA,
                            variables: { datos_reserva },
                        })
                        .then(() => {
                            showMiniSnackbar({
                                title: "Habitación asignada a reserva",
                                text: `La reserva **${lvalue.label}**  quedó asignada a la habitación **${room?.numero_habitacion}.**`,
                                status: "success",
                            })
                            handleFinish()
                        })
                })
                .catch(() => {
                    handleError()
                })
            return
        }
        try {
            const { data: res } = await client.mutate({
                mutation: ASIGNAR_HABITACION_A_RESERVA,
                variables: { datos_reserva },
            })
            if (res) {
                const { data } = await updateStatus("reservada")
                if (data) {
                    showMiniSnackbar({
                        title: "Habitación asignada a reserva",
                        text: `La reserva **${lvalue.label}**  quedó asignada a la habitación **${room?.numero_habitacion}.**`,
                        status: "success",
                    })
                }
            } else {
                handleError()
            }
        } catch (e) {
            handleError()
            console.log(e)
        }
    }

    return (
        <ListView
            title="Asignación de reserva a la habitación"
            subtitle="Elige una reserva que desees vincular a la habitación."
            titleStyle={{ width: "80%" }}
            subtitleStyle={{ fontWeight: 400 }}
        >
            <Title className="detalle-h-general__booking__text">{"Reservas de hoy"}</Title>
            <div className="detalle-h-general__booking__box">
                <Block list scroll className="detalle-h-booking__block-mg">
                    {data?.reservas_sin_asignar_del_dia
                        ?.filter((r) => r.tipo_habitacion_id === room.tipo_habitacion_id)
                        ?.map(({ folio = "", nombre_huesped, reserva_id }, index) => (
                            <TouchableBoldCard
                                key={index}
                                title={`${nombre_huesped}`}
                                subtitle={`RT - ${folio}`}
                                onClick={() =>
                                    setValue({
                                        label: String(folio),
                                        value: `${reserva_id}`,
                                    })
                                }
                                active={`${reserva_id}` === lvalue.value}
                            />
                        ))}
                </Block>
                {data?.reservas_sin_asignar_del_dia && data?.reservas_sin_asignar_del_dia?.length > 0 ? (
                    <PrimaryButton text="Asignar reservación" onClick={handleConfirm} />
                ) : null}
            </div>
        </ListView>
    )
}

export default Booking
