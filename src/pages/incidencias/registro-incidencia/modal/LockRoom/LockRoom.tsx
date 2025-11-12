import { useDispatch, useSelector } from "react-redux"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { Modal, ModalProps } from "src/shared/components/layout/modal/Modal"
import useSnackbar from "src/shared/hooks/useSnackbar"
import Icon from "src/shared/icons"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { RootState } from "src/store/store"
import { Controller, useForm } from "react-hook-form"
import InputVerification from "src/shared/components/forms/input-verification/InputVerification"
import { client } from "src/graphql"
import { LOCK_ROOM } from "src/pages/home/graphql/mutations/rooms.mutations"
import { useEffect, useState } from "react"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import "./LockRoom.css"
import { Estados_Habitaciones, useValidar_Codigo_AutorizacionMutation } from "src/gql/schema"
import { REMOVER_RESERVA_HABITACION } from "src/pages/incidencias/incidencias-graphql/mutations/incidencia"
import { useMutation } from "@apollo/client"
import { UareUFingerprintSample } from "src/shared/classes/fingerprint/UareU/interfaces/UareU.interface"
import useFingerprint from "src/shared/hooks/useFingerprint"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useMotivosBloqueoContext } from "src/shared/providers/MotivosBloqueoProvider"

const defaultValues = {
    motivo_bloqueo: "",
    codigo: "",
    template_sample: "",
}

interface LockRoomProps extends ModalProps {
    onConfirmed?: () => void
    habitacion?: any
}

const LockRoom = ({ isOpen, onClose, onConfirmed, habitacion }: LockRoomProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        clearErrors,
        reset,
        getValues,
        watch,
        setValue,
        trigger,
    } = useForm({ defaultValues })

    const { tiposBloqueo } = useMotivosBloqueoContext()
    const { showSnackbar } = useSnackbar()
    const dispatch = useDispatch()
    const [isConfirmLockLoading, setIsConfirmLockLoading] = useState(false)
    const { usuario_id } = useSelector((state: RootState) => state.profile)
    const [removerReserva] = useMutation(REMOVER_RESERVA_HABITACION)

    const template_sample = watch("template_sample")
    const codigo = watch("codigo")
    const [validateCode] = useValidar_Codigo_AutorizacionMutation()

    useEffect(() => {
        if (isOpen) reset({ codigo: "", motivo_bloqueo: "" })
    }, [isOpen])

    const dispatchResults = () => {
        dispatch(toggleRoomDetailsDrawer(false))
        onClose?.()
        onConfirmed?.()
    }

    const onSubmit = async (values: any) => {
        const authorizedRoles = [RoleNames.admin]

        if (isConfirmLockLoading) {
            return
        }
        const data = await validateCode({
            variables: {
                codigo: values.codigo,
                huella: values.template_sample,
            },
        })
        if (
            !authorizedRoles.find((r) => r === data.data?.validar_codigo_huella_autorizacion.usuario?.roles?.[0].nombre)
        ) {
            if (values.codigo) {
                showSnackbar({
                    title: "Código incorrecto",
                    status: "error",
                })
                return
            }
            showSnackbar({
                status: "error",
                title: "Huella inválida",
                text: "¡Ups! no pudimos reconocer tu huella. Por favor, inténtalo nuevamente.",
            })
            return
        }
        setIsConfirmLockLoading(true)
        if (habitacion?.estado === Estados_Habitaciones.Reservada) {
            removerReserva({
                variables: {
                    remover_data: {
                        habitacion_id: habitacion?.habitacion_id,
                        usuario_id,
                    },
                },
            })
                .then(() => {
                    lock(values)
                })
                .catch((e) => {
                    const message: string = e?.message || ""
                    if (message && message.includes("No se encontro el codigo indicado")) {
                        if (values.codigo) {
                            showSnackbar({
                                title: "Código incorrecto",
                                status: "error",
                            })
                            return
                        }
                        showSnackbar({
                            status: "error",
                            title: "Huella inválida",
                            text: "¡Ups! no pudimos reconocer tu huella. Por favor, inténtalo nuevamente.",
                        })
                        return
                    }
                })
        } else {
            lock(values)
        }
    }

    const lock = async (values) => {
        try {
            await client.mutate({
                mutation: LOCK_ROOM,
                variables: {
                    codigo: values.codigo,
                    template_sample: values.template_sample,
                    bloquear_habitacion_input: {
                        habitacion_id: habitacion?.habitacion_id,
                        usuario_id,
                    },
                },
            })
            dispatchResults()
        } catch (e) {
            if (values.codigo) {
                showSnackbar({
                    title: "Código incorrecto",
                    status: "error",
                })
                return
            }
            showSnackbar({
                status: "error",
                title: "Huella inválida",
                text: "¡Ups! no pudimos reconocer tu huella. Por favor, inténtalo nuevamente.",
            })
        }
        setIsConfirmLockLoading(false)
    }

    const onAcquisition = (fingerprint: UareUFingerprintSample) => {
        if (!isOpen) {
            return
        }
        if (!getValues().motivo_bloqueo) {
            showSnackbar({
                status: "error",
                title: "Para continuar selecciona un motivo",
            })
            return
        }
        setValue("template_sample", JSON.parse(fingerprint.samples)[0]?.Data)
    }

    // limpiar codigo al usar huella
    useEffect(() => {
        if (!template_sample) {
            return
        }
        setValue("codigo", "")
        trigger("codigo")
    }, [template_sample])

    // ejecutar el submit al llenar huella con formulario llenado
    useEffect(() => {
        if (template_sample && !codigo) {
            onSubmit(getValues())
        }
    }, [template_sample, codigo])

    const { startAcquisition, stopAcquisition } = useFingerprint({
        client: "UareU",
        onAcquisition,
    })

    useEffect(() => {
        if (isOpen) {
            return startAcquisition()
        }
        return () => {
            stopAcquisition()
        }
    }, [isOpen])

    return (
        <Modal
            className="modal-lock-room"
            withCloseButton
            isOpen={isOpen}
            isCancelableOnClickOutside={false}
            onClose={() => onClose?.()}
        >
            <form className="modal-lock-room__content" onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-lock-room__main">
                    <div className="modal-lock-room__top">
                        <IconBorder
                            secondaryBgColor={"var(--ocupada-card-1)"}
                            secondaryBgDiameter={60}
                            primaryBgColor={"var(--pink-ocupado)"}
                            primaryBgDiameter={30}
                        >
                            <Icon name={"LockFill"} height={18} width={18} color={"var(--white)"}></Icon>
                        </IconBorder>
                        <div className="modal-lock-room__head">
                            <span className="modal-lock-room__title modal-lock-room__text">Bloquear habitación</span>
                            <span className="modal-lock-room__description modal-lock-room__text">
                                {`${habitacion?.tipo_habitacion?.nombre} ${habitacion?.numero_habitacion}`}
                            </span>
                        </div>
                    </div>
                    <Controller
                        control={control}
                        name={"motivo_bloqueo"}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                            <Dropdown
                                icon="userFilled"
                                errorHintText={errors.motivo_bloqueo ? "Selecciona un motivo de bloqueo" : undefined}
                                value={value}
                                label="Motivo de bloqueo"
                                placeholder="Selecciona una opción"
                                onClick={(value) => {
                                    onChange(value.value)
                                }}
                                options={tiposBloqueo?.map((m) => {
                                    return {
                                        value: m.nombre,
                                        label: m.nombre,
                                    }
                                })}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name={"codigo"}
                        rules={{ required: !template_sample, minLength: 4 }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <InputVerification
                                className="modal-lock-room__input-veification"
                                label="Código de autorización para bloqueo"
                                value={value}
                                onChange={(value) => {
                                    onChange(value)
                                    setValue("template_sample", "")
                                    if (error) clearErrors("codigo")
                                }}
                                error={!!error}
                                hintText={
                                    error
                                        ? error.type === "minLength"
                                            ? "Escribe el código completo"
                                            : "Escribe el código"
                                        : ""
                                }
                            />
                        )}
                    />
                </div>
                <PrimaryButton text={"Bloquear habitación"} type="submit" />
            </form>
        </Modal>
    )
}

export default LockRoom
