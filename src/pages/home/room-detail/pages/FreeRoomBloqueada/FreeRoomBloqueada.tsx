import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Screen from "src/shared/components/layout/screen/Screen"
import LayoutFree from "src/pages/home/room-detail/sections/layout-free/LayoutFree"
import MultipleSelectDropdown from "src/shared/components/forms/MultipleSelectDropdown/MultipleSelectDropdown"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { useRoomStore } from "../../hooks"
import { useRoomDarwer } from "../../hooks/darwer"
import { useRoomMethods } from "../../hooks/methods"
import { useSelectedRoom } from "../../hooks/selected"
import { useColaborador } from "../../hooks/colaborador"
import { Puestos } from "src/constants/puestos"
import { useCleaningTypes } from "../../hooks/limpieza"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { assignColaborador } from "../../helpers/colaborador"
import { Estados_Habitaciones, TiposLimpiezas, TiposTarea } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { usePuestos } from "../../hooks/usePuestos"
import "./FreeRoomBloqueada.css"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useLoadingState from "src/shared/hooks/useLoadingState"

type Selection = {
    personal: { colaborador_id: string; nombre: string }[]
    type: TiposLimpiezas | ""
}

interface Errors {
    personal: boolean
    type: boolean
    reasonBlock: boolean
}

const errorInitialValue: Errors = {
    personal: false,
    type: false,
    reasonBlock: false,
}

const options = [
    {
        label: "Sucia",
        icon: "trashFilled",
        key: Estados_Habitaciones.Sucia,
    },
    {
        label: "Limpieza",
        icon: "broom",
        key: Estados_Habitaciones.Limpieza,
    },
    {
        label: "Pendiente de supervisión",
        icon: "SearchWatch",
        key: Estados_Habitaciones.SupervisionPendiente,
    },
]

function FreeRoomBloqueada(): JSX.Element {
    const [selection, setSelection] = useState<Selection>({ personal: [], type: "" })
    const [error, setError] = useState<Errors>(errorInitialValue)
    const [value, setValue] = useState<string>(Estados_Habitaciones.Sucia)
    const navigate = useNavigate()

    const { data } = useColaborador(Puestos.RECAMARISTA)
    const cleaningTypes = useCleaningTypes()
    const { isLoading, isLoadingDelayed, toggleIsLoading } = useLoadingState()

    const room = useSelectedRoom()
    const { handleFinish } = useRoomStore()
    const { updateStatus } = useRoomMethods()
    const { showSnackbar } = useSnackbar()
    const { onClose } = useRoomDarwer()

    const { usuario_id } = useProfile()
    const puestos = usePuestos()

    const handleBase = () => {
        const keys = {
            sucia: "sucia",
            limpieza: "limpieza",
            supervision_pendiente: "pendiente de supervisión",
        }
        updateStatus(value)
            .then(({ data }) => {
                if (data) {
                    showSnackbar({
                        title: "Bloqueo finalizado",
                        text: `La habitación **${room?.nombre}** pasó de **bloqueada** a **${keys[value]}.**`,
                        status: "success",
                    })
                    handleFinish(() => {
                        onClose()
                        navigate(-1)
                    })
                } else {
                    showSnackbar({
                        title: "Error al desbloquear habitación",
                        status: "error",
                    })
                }
            })
            .catch((e) => {
                showSnackbar({
                    title: "Error al desbloquear habitación",
                    status: "error",
                })
                console.log(e)
            })
    }

    const handleClean = () => {
        const description = `Limpieza de la habitación ${room?.nombre}`
        if (isLoadingDelayed) {
            return
        }
        toggleIsLoading({ value: true })
        if (!selection.personal.length) {
            toggleIsLoading({ value: false })
            return setError((e) => ({ ...e, personal: true }))
        }
        if (!selection.type) {
            toggleIsLoading({ value: false })
            return setError((e) => ({ ...e, type: true }))
        }
        assignColaborador({
            datos_tarea: {
                nombre: "Limpieza de habitación",
                descripcion: description,
                puesto_id: puestos.find((p) => p?.nombre === Puestos.RECAMARISTA)?.puesto_id || "",
                tipo: TiposTarea.Limpieza,
            },
            datos_colaborador_tarea: {
                colaborador_ids: selection.personal.map((c) => c.colaborador_id),
                descripcion_tarea: description,
                habitacion_id: room?.habitacion_id,
                tipo_limpieza: selection.type,
            },
            usuario_id,
            estadoHabitacion: Estados_Habitaciones.Limpieza,
        })
            .then(() => {
                if (selection.personal.length <= 1) {
                    showSnackbar({
                        title: "Limpieza de habitación",
                        text: `**${selection.personal[0].nombre}** comenzará con la **${selection.type}** de la habitación **${room?.nombre}**`,
                        status: "success",
                    })
                } else {
                    showSnackbar({
                        title: "Limpieza de habitación",
                        text: `**${selection.personal.length} camaristas** comenzarán con la **${selection.type}** de la habitación **${room?.nombre}**`,
                        status: "success",
                    })
                }
                handleFinish(() => {
                    onClose()
                    navigate(-1)
                })
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al desbloquear habitación",
                    status: "error",
                })
            })
            .finally(() => {
                toggleIsLoading({ value: false })
            })
    }

    const handleClick = () => {
        if (value === Estados_Habitaciones.Limpieza) {
            handleClean()
        } else {
            handleBase()
        }
    }

    return (
        <Screen title={""} close onClose={() => navigate(-1)}>
            <LayoutFree
                className="free-room-bloqueada"
                value={value}
                title={
                    <>
                        {"Después de concluir el bloqueo"}
                        <br />
                        {`¿Qué estado deseas asignar a la habitación ${room?.numero_habitacion}?`}
                    </>
                }
                options={options}
                onChange={(value) => setValue(value)}
                onClick={handleClick}
            >
                {value === options[1].key ? (
                    <>
                        <div className="free-room-mantenimiento__select">
                            <MultipleSelectDropdown<{
                                colaborador_id: string
                                nombre: string
                            }>
                                editable={true}
                                style={{ marginBottom: 6 }}
                                icon="userFilled"
                                maxSelections={4}
                                errorHintText={error.personal ? "Selecciona una camarista" : undefined}
                                value={selection.personal}
                                label="Camaristas disponibles"
                                placeholder="Selecciona una camarista"
                                onChange={(value) => {
                                    setSelection((s) => ({
                                        ...s,
                                        personal: value.map((v) => ({
                                            colaborador_id: v.colaborador_id,
                                            nombre: v.nombre,
                                        })),
                                    }))
                                    if (value?.length > 0) {
                                        return setError((e) => ({ ...e, personal: false }))
                                    }
                                    return setError((e) => ({ ...e, personal: true }))
                                }}
                                options={data?.map((r) => {
                                    return {
                                        withCheckbox: true,
                                        withPhoto: true,
                                        value: {
                                            colaborador_id: r.colaborador_id,
                                            nombre: r.nombre,
                                        },
                                        label: r.nombre,
                                        photoSrc: r.foto,
                                    }
                                })}
                            />
                        </div>
                        <div className="free-room-mantenimiento__select" style={{ marginBottom: 6 }}>
                            <Dropdown
                                value={selection.type}
                                onClick={({ value = "" }) => {
                                    setSelection({ ...selection, type: value })
                                    if (value) {
                                        return setError((e) => ({ ...e, type: false }))
                                    }
                                    return setError((e) => ({ ...e, type: true }))
                                }}
                                label="Tipo de limpieza"
                                placeholder="Selecciona una opción"
                                icon="broom"
                                options={cleaningTypes.map(({ value, label = "", minutes = "" }) => {
                                    return {
                                        label: `${label} - ${minutes}`,
                                        value,
                                    }
                                })}
                                iconInOptions={false}
                                errorHintText={error.type ? "Selecciona un tipo " : ""}
                            />
                        </div>
                    </>
                ) : (
                    <div className="free-room-mantenimiento__space" />
                )}
            </LayoutFree>
            <LoaderComponent visible={isLoading} />
        </Screen>
    )
}

export default FreeRoomBloqueada
