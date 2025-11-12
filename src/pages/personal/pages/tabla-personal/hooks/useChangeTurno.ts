import { useState } from "react"
import { Colaborador, useAbrirTurnoColaboradorMutation, useCerrarTurnoColaboradorMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { AlertModalState } from "../types/screen"
import { evalDisponibilidadColaborador } from "./useFetch"
import { useDispatch } from "react-redux"
import { togglePersonalTurnoDrawer } from "src/store/personal/personal.slice"

const useChangeTurno = ({
    colaboradores,
    handleRefetch,
    setAlertModal,
}: {
    colaboradores: Colaborador[]
    handleRefetch: () => void
    setAlertModal: (v: AlertModalState) => void
}) => {
    const { hotel_id, usuario_id } = useProfile()
    const { showSnackbar } = useSnackbar()
    const [loadId, setLoadId] = useState<string>("")
    const dispatch = useDispatch()

    const [abrirTurnoColaborador] = useAbrirTurnoColaboradorMutation()
    const [cerrarTurnoColaborador] = useCerrarTurnoColaboradorMutation()

    const handleChangeTurno = (colaborador_id: any, value: boolean) => {
        const colaborador = colaboradores.find((item) => item?.colaborador_id === colaborador_id)

        if (colaborador) {
            if (value) {
                setLoadId(colaborador_id)
                abrirTurnoColaborador({
                    variables: {
                        turnOnTurnoColaboradorInput: {
                            colaborador_id,
                            hotel_id,
                            usuario_id,
                        },
                    },
                })
                    .then(({ data }) => {
                        handleRefetch()
                        showSnackbar({
                            status: "success",
                            title: "Personal activado exitosamente",
                            text: `El turno de **${colaborador?.nombre}** ha sido **activado**.`,
                        })
                    })
                    .catch((e) => {
                        showSnackbar({
                            title: "Error al activar personal",
                            text: e?.message || "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                            status: "error",
                        })
                    })
                    .finally(() => {
                        setLoadId("")
                        dispatch(togglePersonalTurnoDrawer(false))
                    })
            } else {
                const { isDisponible } = evalDisponibilidadColaborador(colaborador)

                if (isDisponible) {
                    const find = colaboradores.find((f) => f.colaborador_id === colaborador_id)
                    const asistencia_id = find?.asistencia_abierta?.asistencia_id || ""

                    setLoadId(colaborador_id)
                    cerrarTurnoColaborador({
                        variables: {
                            turnOffColaboradoresInput: {
                                asistencia_id: asistencia_id ? [asistencia_id] : [],
                                colaborador_id: [colaborador_id],
                                usuario_id,
                                hotel_id,
                            },
                        },
                    })
                        .then(({ data }) => {
                            handleRefetch()
                            showSnackbar({
                                status: "success",
                                title: "Personal desactivado exitosamente",
                                text: `El turno de **${colaborador?.nombre}** ha sido **desactivado**.`,
                            })
                        })
                        .catch((e) => {
                            console.log(e)
                            showSnackbar({
                                title: "Error al desactivar personal",
                                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                                status: "error",
                            })
                        })
                        .finally(() => {
                            setLoadId("")
                            dispatch(togglePersonalTurnoDrawer(false))
                        })
                } else {
                    setAlertModal({ nombre: colaborador?.nombre, visible: true })
                }
            }
        }
    }

    return {
        handleChangeTurno,
        loadId,
    }
}

export default useChangeTurno
