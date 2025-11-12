import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { Puestos } from "src/constants/puestos"
import { useAbrirTurnoColaboradorMutation, useCerrarTurnoColaboradorMutation } from "src/gql/schema"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import DrawerTitle from "src/pages/personal/components/DrawerTitle/DrawerTitle"
import DrawerWrappper from "src/pages/personal/components/DrawerWrapper/DrawerWrappper"
import DrawerContent from "src/pages/personal/components/Drawercontent/DrawerContent"
import { useColaboradorSelected } from "src/pages/personal/pages/tabla-personal/hooks/useSelected"
import AlertTaskModal from "src/pages/personal/pages/tabla-personal/modals/alert-task"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { formatDiffTimeShort } from "src/shared/helpers/formatDiffTimeShort"
import { useDate } from "src/shared/hooks/useDate"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { useProfile } from "src/shared/hooks/useProfile"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useTimePulse } from "src/shared/hooks/useTimePulse"
import {
    selectPersonalDrawerSection,
    togglePersonalTurnoDrawer,
} from "src/store/personal/personal.slice"

const Home = ({handleRefetch}: {handleRefetch: () => void}) => {
    const [now] = useTimePulse()
    const { UTCStringToLocalDate } = useDate()
    const { colaboradorSelected } = useColaboradorSelected()
    const { hotel_id, usuario_id } = useProfile()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const [visible, setVisible] = useState<boolean>(false)

    const [abrirTurnoColaborador] = useAbrirTurnoColaboradorMutation()
    const [cerrarTurnoColaborador] = useCerrarTurnoColaboradorMutation()
    const dispatch = useDispatch()

    const { showSnackbar } = useSnackbar()

    const onCerrarTurnoColaborador = () => {
        cerrarTurnoColaborador({
            variables: {
                turnOffColaboradoresInput: {
                    asistencia_id: [colaboradorSelected?.asistencia_abierta?.asistencia_id || ""],
                    colaborador_id: [colaboradorSelected?.colaborador_id || ""],
                    hotel_id,
                    usuario_id,
                },
            },
        })
            .catch((e) => {
                showSnackbar({
                    title: "Error al desactivar personal",
                    text: e?.message || "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
            .then(() => {
                showSnackbar({
                    status: "success",
                    title: "Personal desactivado exitosamente",
                    text: `El turno de **${colaboradorSelected?.nombre} ${colaboradorSelected?.apellido_paterno} ${colaboradorSelected?.apellido_materno}** ha sido **desactivado**.`,
                })
            })
            .finally(() => {
                handleRefetch()
                dispatch(togglePersonalTurnoDrawer(false))
            })
    }

    const onAbrirTurnoColaborador = () => {
        abrirTurnoColaborador({
            variables: {
                turnOnTurnoColaboradorInput: {
                    colaborador_id: colaboradorSelected?.colaborador_id || "",
                    hotel_id,
                    usuario_id,
                },
            },
        })
            .catch((e) => {
                showSnackbar({
                    title: "Error al activar personal",
                    text: e?.message || "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
            .then(() => {
                showSnackbar({
                    status: "success",
                    title: "Personal activado exitosamente",
                    text: `El turno de **${colaboradorSelected?.nombre} ${colaboradorSelected?.apellido_paterno} ${colaboradorSelected?.apellido_materno}** ha sido **activado**.`,
                })
            })
            .finally(() => {
                handleRefetch()
                dispatch(togglePersonalTurnoDrawer(false))
            })
    }
    const puestosRestaurante = [
        Puestos.CHEF,
        Puestos.COCINERO,
        Puestos.AYUDANTECOCINA,
        Puestos.MESERO,
        Puestos.BARTENDER,
        Puestos.LAVALOZA,
    ]

    const puestoshabitacion = [
        Puestos.AMALLAVES,
        Puestos.RECAMARISTA,
        Puestos.SUPERVISOR,
    ]

    return (
        <DrawerWrappper
            footerChildren={
                colaboradorSelected?.en_turno ? (
                    <PrimaryButton
                        text="Desactivar personal"
                        onClick={validateIsColabActive(() => {
                            if (colaboradorSelected.habitacion_asignada) {
                                setVisible(true)
                            } else {
                                onCerrarTurnoColaborador()
                            }
                        })}
                    />
                ) : (
                    <PrimaryButton text="Activar personal" onClick={validateIsColabActive(() => onAbrirTurnoColaborador())} />
                )
            }
        >
            <DrawerTitle
                titleStyle={{
                    maxWidth: "calc(100% - 25px)",
                }}
                title={`${colaboradorSelected?.nombre} ${colaboradorSelected?.apellido_paterno} ${colaboradorSelected?.apellido_materno}`}
                subtitle={`${colaboradorSelected?.colaborador_in_hotel?.[0]?.puesto?.nombre}`}
            />
            <DrawerContent>
                <DescriptionDetail
                    label="Turno asignado"
                    style={{
                        padding: "12px",
                    }}
                    value={colaboradorSelected?.turno?.nombre || ""}
                    icon="calendarFill"
                />
                {puestoshabitacion.includes(
                    colaboradorSelected?.colaborador_in_hotel?.[0]?.puesto?.nombre as Puestos
                ) && (
                    <DescriptionDetail
                        label="Habitación asignada"
                        style={{
                            padding: "12px",
                        }}
                        value={
                            !colaboradorSelected?.ultima_tarea || colaboradorSelected?.ultima_tarea?.fecha_termino
                                ? "Sin asignar"
                                : `
                                        ${
                                            colaboradorSelected?.ultima_tarea?.habitacion?.tipo_habitacion?.nombre || ""
                                        } ${colaboradorSelected?.ultima_tarea?.habitacion?.numero_habitacion}`
                        }
                        link={
                            colaboradorSelected.en_turno
                                ? !colaboradorSelected.habitacion_asignada
                                    ? "Asignar habitación"
                                    : "Reasignar habitación"
                                : ""
                        }
                        onLink={validateIsColabActive(() => {
                            if (!colaboradorSelected.habitacion_asignada) {
                                return dispatch(selectPersonalDrawerSection("rooms-to-maintenance"))
                            }
                            dispatch(selectPersonalDrawerSection("rooms-to-reassign-maintenance"))
                        })}
                        icon="building4Fill"
                    />
                )}
                {puestosRestaurante.includes(
                    colaboradorSelected?.colaborador_in_hotel?.[0]?.puesto?.nombre as Puestos
                ) && (
                    <DescriptionDetail
                        label="Órdenes atendidas en el día"
                        style={{
                            padding: "12px",
                        }}
                        value={colaboradorSelected?.cantidad_ordenes?.toString() ?? "-"}
                        icon="WaiterKitchenFilled"
                    />
                )}

                <DescriptionDetail
                    label="Tiempo total trabajado"
                    style={{
                        padding: "12px",
                    }}
                    value={
                        colaboradorSelected?.asistencia_abierta
                            ? `
                            ${formatDiffTimeShort(
                                UTCStringToLocalDate(colaboradorSelected?.asistencia_abierta?.fecha_entrada) || "",
                                now
                            )}`
                            : "-"
                    }
                    icon="Clock"
                />
            </DrawerContent>
            <AlertTaskModal
                visible={visible}
                onClose={() => setVisible(false)}
                name={`${colaboradorSelected?.nombre} ${colaboradorSelected?.apellido_paterno} ${colaboradorSelected?.apellido_materno}`}
            />
            {InactiveModal}
        </DrawerWrappper>
    )
}

export default Home
