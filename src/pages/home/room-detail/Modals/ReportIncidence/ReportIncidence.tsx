/* eslint-disable indent */
import { useMutation, useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import { useForm } from "react-hook-form"
import { CREATE_INCIDENCE } from "src/graphql/mutations/incidence"
import { InputText, TextBox } from "src/shared/components/forms"
import InputTabs from "src/shared/components/forms/input-tabs/InputTabs"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import { Modal, ModalProps } from "src/shared/components/layout/modal/Modal"
import Icon from "src/shared/icons"
import { useRoom } from "../../hooks"
import { PrimaryButton } from "../../sections/elements/Elements"
import userFilled from "src/shared/icons/UserFilled"
import "./ReportIncidence.css"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { useTurnoActual } from "../../hooks/turnos"
import { formatLongDate } from "src/shared/helpers/formatLongDate"
import { HOTEL_COLABORADORES } from "src/pages/home/graphql/queries/colaborador"
import { useProfile } from "src/shared/hooks/useProfile"
import { getDateStringMDY } from "src/utils/date"
import { useDate } from "src/shared/hooks/useDate"
import Checkbox from "src/shared/components/forms/checkbox/Checkbox"
import { Estados_Habitaciones, useActualizar_Colaboradores_TareasMutation } from "src/gql/schema"
import LockRoom from "src/pages/incidencias/registro-incidencia/modal/LockRoom/LockRoom"
import { useDispatch } from "react-redux"
import { startGetLastReservation, startGetSelectedRoom } from "src/pages/home/store/thunks/rooms.thunk"
import useMaskMatricula from "src/shared/masks/mask-matricula/mask-matricula"
import {
    placeTypesModal,
    severityTypes,
    types,
    typesHabitacion,
} from "src/pages/incidencias/registro-incidencia/RegistroIncidencia.constants"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { useRoomDarwer } from "../../hooks/darwer"

const defaultValues = {
    colaborador_nombre_reporta: "",
    detalle: "",
    severidad: "",
    bloquear: false,
    huesped: "",
    matricula: "",
    place: "",
    type: "",
}

const ReportIncidence = ({ isOpen, onClose }: ModalProps) => {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({ defaultValues })
    const { hotel_id, usuario_id } = useProfile()
    const dispatch = useDispatch()
    const room = useRoom()
    const { UTCStringToLocalDate } = useDate()
    const [isModalLockOpen, setLockModal] = useState<boolean>(false)
    const [finalizarTarea] = useActualizar_Colaboradores_TareasMutation()
    const { value: formattedMatriculaValue, maskChange } = useMaskMatricula()
    const { onClose: onDrawerClose } = useRoomDarwer()

    // Agregar por defecto el nombre del huesped y su matrícula en caso de haberlas puesto en el formulario de renta
    useEffect(() => {
        setValue("huesped", room?.ultima_renta?.nombre_huesped || "")
        setValue("matricula", room?.ultima_renta?.vehiculo?.matricula || "")
    }, [])

    const { data: respColaboradores } = useQuery(HOTEL_COLABORADORES, {
        variables: {
            hotel_id,
        },
    })
    const [createIncidence] = useMutation(CREATE_INCIDENCE)
    const turnoActual = useTurnoActual()
    const dataForm = watch()

    const { showMiniSnackbar } = useMiniSnackbar()

    const onSubmit = async () => {
        //muestra la modal de bloqueo
        if (
            dataForm.severidad === "alta" &&
            dataForm.bloquear &&
            dataForm.place === "habitación" &&
            room.estado !== Estados_Habitaciones.Ocupada &&
            room.estado !== Estados_Habitaciones.Bloqueada
        ) {
            setLockModal(true)
        } else {
            createIncidencia()
        }
    }

    const createIncidencia = async () => {
        if (dataForm.severidad === "alta" && dataForm.place === "habitación") {
            if (room?.estado === Estados_Habitaciones.Limpieza) {
                await finalizarTarea({
                    variables: {
                        datos_tarea: {
                            usuario_id,
                            hotel_id,
                            colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                                (c) => c?.colaborador_tarea_id
                            ),
                            estado:
                                dataForm.bloquear === false
                                    ? Estados_Habitaciones.SupervisionPendiente
                                    : Estados_Habitaciones.Bloqueada,
                        },
                    },
                })
            }
            if (room?.estado === Estados_Habitaciones.Mantenimiento) {
                await finalizarTarea({
                    variables: {
                        datos_tarea: {
                            usuario_id,
                            hotel_id,
                            colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                                (c) => c?.colaborador_tarea_id
                            ),
                            estado:
                                dataForm.bloquear === false
                                    ? Estados_Habitaciones.Sucia
                                    : Estados_Habitaciones.Bloqueada,
                        },
                    },
                })
            }
            if (room?.estado === Estados_Habitaciones.Supervision) {
                await finalizarTarea({
                    variables: {
                        datos_tarea: {
                            usuario_id,
                            hotel_id,
                            colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                                (c) => c?.colaborador_tarea_id
                            ),
                            estado:
                                dataForm.bloquear === false
                                    ? Estados_Habitaciones.Preparada
                                    : Estados_Habitaciones.Bloqueada,
                        },
                    },
                })
            }
        }

        createIncidence({
            variables: {
                createIncidenciaInput: {
                    colaborador_id_reporta: respColaboradores?.colaboradores.find(
                        (c) =>
                            `${c.nombre} ${c.apellido_paterno} ${c.apellido_materno}` ===
                            dataForm.colaborador_nombre_reporta
                    )?.colaborador_id,
                    detalle: dataForm.detalle,
                    habitacion_id: room.habitacion_id,
                    severidad: dataForm.severidad,
                    turno_id: turnoActual?.turno_id,
                    fecha_registro: new Date().toISOString(),
                    area: dataForm.place,
                    hotel_id,
                    huesped: dataForm.huesped,
                    matricula: dataForm.matricula,
                    tipo_incidencia: dataForm.type,
                },
            },
            onCompleted: ({ crear_incidencia }) => {
                onClose?.()
                reset()
                // // Despues haber finalizado la petición el drawer se cierra
                onDrawerClose()

                if (false) {
                    dispatch(startGetSelectedRoom(room?.habitacion_id))
                    dispatch(startGetLastReservation(room?.ultima_reserva?.reserva?.reserva_id))
                }

                const messageBloquear =
                    dataForm.bloquear &&
                    room?.estado !== Estados_Habitaciones.Ocupada &&
                    room?.estado !== Estados_Habitaciones.Bloqueada
                        ? `**La habitación ${room?.nombre} fue bloqueada.**`
                        : ""

                let message = `Se registró la incidencia con **folio ${crear_incidencia.folio}, el día ${formatLongDate(
                    UTCStringToLocalDate(crear_incidencia.fecha_registro)
                )}.**`
                if (room?.estado === Estados_Habitaciones.Reservada && dataForm.bloquear) {
                    message = `La **habitación ${room?.nombre}** ha sido bloqueada exitosamente. La asignación de reserva fue eliminada, asigna otra habitación desde el módulo de reservas.`
                } else if (messageBloquear && dataForm.severidad === "alta" && dataForm.place === "habitación") {
                    message += ` ${messageBloquear}`
                }

                showMiniSnackbar({
                    title: "Incidencia creada",
                    status: "success",
                    text: message,
                })
            },
            onError: (error) => {
                onClose?.()
                reset()
                // // Despues haber finalizado la petición el drawer se cierra
                onDrawerClose()
                showMiniSnackbar({
                    title: "Error al crear una incidencia",
                    status: "error",
                    text: "¡Ups! Se ha producido un error, Por favor, inténtalo nuevamente.",
                })
            },
        })
    }

    return (
        <Modal
            width={600}
            withCloseButton
            isOpen={isOpen}
            isCancelableOnClickOutside={false}
            onClose={() => {
                onClose?.()
                reset()
            }}
           className="modal-report-incidence"
        >
            <div className="modal-report-incidence__header">
                <span className="modal-report-incidence__title">Registro de incidencia</span>

                <div className="modal-report-incidence__descriptions">
                    <span className="modal-report-incidence__subtitle">
                        <Icon name={"calendarFill"} /> {getDateStringMDY(new Date())}
                    </span>
                    <span className="modal-report-incidence__subtitle">
                        <Icon name={"Stopwatch"} /> {turnoActual?.nombre || ""}
                    </span>
                    {dataForm.place === "habitación" && (
                        <span className="modal-report-incidence__subtitle">
                            <Icon name={"BedFilled"} /> {room?.nombre || ""}
                        </span>
                    )}
                </div>
            </div>

            <div className="modal-report-incidence__scrollable">
                <form className="modal-report-incidence__form" onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="colaborador_nombre_reporta"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <InputTextSuggestions
                                suggestionsListWidth="600px"
                                suggestions={respColaboradores?.colaboradores?.map(
                                    (c) => `${c.nombre} ${c.apellido_paterno} ${c.apellido_materno}`
                                )}
                                value={value}
                                inputTextConfig={{
                                    style: { width: "100%" },
                                    label: "Nombre de quien reportó",
                                    placeholder: "Escribe el nombre del personal",
                                    type: "text",
                                    icon: userFilled,
                                    error: !!errors.colaborador_nombre_reporta,
                                    errorhinttext: errors.colaborador_nombre_reporta ? "Escoge un nombre" : "",
                                }}
                                onChange={(data) => {
                                    onChange(data)
                                }}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name={"place"}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                            <InputTabs
                                value={value || ""}
                                className="modal-incidencia__tabs-place"
                                containerClassName="modal-incidencia__tabs-place-container"
                                label="Ubicación o responsable"
                                items={placeTypesModal}
                                onChange={(value) => {
                                    onChange(value)
                                    setValue("type", "")
                                }}
                                style={{
                                    width: "100%",
                                }}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name={"type"}
                        rules={{ required: true }}
                        render={({ field: { value, onChange }, formState: { errors } }) => (
                            <Dropdown
                                label={"Tipo de incidencia"}
                                type={"text"}
                                placeholder={"Selecciona una opción"}
                                value={value}
                                onClick={({ label, value }) => {
                                    onChange(label)
                                    setValue("type", value)
                                }}
                                options={
                                    dataForm.place &&
                                    Object.values(placeTypesModal).some((place) => place.value === dataForm.place)
                                        ? dataForm.place === placeTypesModal[1].value
                                            ? types || [{ label: "-", value: "-1" }]
                                            : typesHabitacion || [{ label: "-", value: "-1" }]
                                        : [{ label: "", value: "" }]
                                }
                                errorHintText={errors.type ? "Selecciona una opción" : ""}
                                icon={"surveyFill"}
                                iconInOptions={false}
                                className={value ? "dropdown-registro-indicencia-no-border" : ""}
                            />
                        )}
                    />
                    <div className="modal-report-incidence__container-huesped">
                        <>
                            <Controller
                                control={control}
                                name={"huesped"}
                                render={({ field: { value, onChange }, formState: { errors } }) => (
                                    <InputText
                                        icon={Icon}
                                        iconProps={{
                                            name: "userFilled",
                                        }}
                                        label={
                                            dataForm.type === types[0].value
                                                ? "Huésped o responsable (opcional)"
                                                : "Nombre del huésped o responsable (opcional) "
                                        }
                                        type={"text"}
                                        placeholder={"Nombre"}
                                        value={value}
                                        onChange={(e) => onChange(e.target.value)}
                                        onKeyUp={(e) => {
                                            if (e.key === "Enter") e.preventDefault()
                                        }}
                                    />
                                )}
                            />
                            {dataForm.place === placeTypesModal[1].value && dataForm.type === types[0].value && (
                                <Controller
                                    control={control}
                                    name={"matricula"}
                                    render={({ field: { value, onChange }, formState: { errors } }) => (
                                        <InputText
                                            icon={Icon}
                                            iconProps={{
                                                name: "iconHash",
                                            }}
                                            label={"Matrícula (opcional)"}
                                            type={"text"}
                                            placeholder={"Escribe la matrícula"}
                                            value={value}
                                            onKeyDown={maskChange}
                                            onChange={(e) => onChange(formattedMatriculaValue)}
                                            onKeyUp={(e) => {
                                                if (e.key === "Enter") e.preventDefault()
                                            }}
                                        />
                                    )}
                                />
                            )}
                        </>
                    </div>
                    <Controller
                        control={control}
                        name={"severidad"}
                        rules={{ required: "Escribe un nombre" }}
                        render={({ field: { value, onChange } }) => (
                            <InputTabs
                                value={value || ""}
                                className="modal-report-incidence__tabs"
                                containerClassName="modal-report-incidence__tabs-container"
                                items={severityTypes}
                                label="Urgencia"
                                onChange={(value) => {
                                    onChange(value)
                                    if (value === "alta" && room) setValue("bloquear", true)
                                }}
                                style={{
                                    width: "100%",
                                }}
                            />
                        )}
                    />
                    {dataForm.severidad === "alta" &&
                        dataForm.place === "habitación" &&
                        room.estado !== Estados_Habitaciones.Ocupada &&
                        room.estado !== Estados_Habitaciones.Bloqueada && (
                            <Controller
                                control={control}
                                name={"bloquear"}
                                render={({ field: { value, onChange } }) => (
                                    <Checkbox
                                        className="modal-report-incidence__check"
                                        label="Bloquear habitación"
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                            />
                        )}

                    <Controller
                        control={control}
                        name={"detalle"}
                        rules={{ required: true }}
                        render={({ field: { value, onChange }, formState: { errors } }) => (
                            <TextBox
                                value={value}
                                onChange={(value) => {
                                    onChange(value)
                                }}
                                description="Agrega la descripción de la incidencia"
                                placeholder="Escribe un comentario..."
                                className="modal-report-incidence__textarea"
                                error={!!errors.detalle}
                                errorHintText={"Escribe la descripción"}
                            />
                        )}
                    />
                </form>
            </div>
            <div className="modal-report-incidence__footer">
                <PrimaryButton
                    className="modal-report-incidence__button"
                    type="submit"
                    text={"Reportar incidencia"}
                    onClick={handleSubmit(onSubmit)}
                />
            </div>
            <LockRoom
                isOpen={isModalLockOpen}
                onClose={() => setLockModal(false)}
                onConfirmed={() => createIncidencia()}
                habitacion={room}
            />
        </Modal>
    )
}

export default ReportIncidence
