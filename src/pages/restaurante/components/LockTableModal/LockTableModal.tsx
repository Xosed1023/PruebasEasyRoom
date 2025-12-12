import { useDispatch, useSelector } from "react-redux"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { Modal, ModalProps } from "src/shared/components/layout/modal/Modal"
import useSnackbar from "src/shared/hooks/useSnackbar"
import Icon from "src/shared/icons"
import { RootState } from "src/store/store"
import { Controller, useForm } from "react-hook-form"
import InputVerification from "src/shared/components/forms/input-verification/InputVerification"
import { useEffect, useState } from "react"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import "./LockTableModal.css"
import { toggleRestaurantDrawer } from "src/store/restaurant/restaurantSlice"
import { motivosBloqueoMesa } from "src/constants/motivosBloqueoMesa"
import { EstadoMesa, useActualizarMesaMutation, useValidar_Codigo_AutorizacionMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { RoleNames } from "src/shared/hooks/useAuth"
import useFingerprint from "src/shared/hooks/useFingerprint"
import { UareUFingerprintSample } from "src/shared/classes/fingerprint/UareU/interfaces/UareU.interface"

interface DefaultValues {
    motivo_bloqueo: string
    codigo: string
    template_sample: string
}

const defaultValues: DefaultValues = {
    motivo_bloqueo: "",
    codigo: "",
    template_sample: "",
}

interface LockTableModalProps extends ModalProps {
    onConfirmed?: () => void
    mesa?: any
}

const LockTableModal = ({ isOpen, onClose, onConfirmed, mesa }: LockTableModalProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        clearErrors,
        reset,
        getValues,
        watch,
        setValue,
    } = useForm({ defaultValues })

    const { rolName } = useProfile()
    const { showSnackbar } = useSnackbar()
    const dispatch = useDispatch()
    const [isConfirmLockLoading, setIsConfirmLockLoading] = useState(false)
    const { usuario_id } = useSelector((state: RootState) => state.profile)
    const [bloquearMesa] = useActualizarMesaMutation()
    const codigo = watch("codigo")
    const template_sample = watch("template_sample")

    useEffect(() => {
        if (isOpen) reset({ codigo: "", motivo_bloqueo: "", template_sample: "" })
    }, [isOpen])

    const dispatchResults = () => {
        dispatch(toggleRestaurantDrawer(false))
        onClose?.()
        onConfirmed?.()
    }
    const [validateUser] = useValidar_Codigo_AutorizacionMutation()

    const onSubmit = async (values: DefaultValues) => {
        if (isConfirmLockLoading) {
            return
        }
        setIsConfirmLockLoading(true)

        const { data } = await validateUser({
            variables: {
                codigo,
                huella: values.template_sample,
            },
        })
        
        if (
            ![RoleNames.superadmin, RoleNames.admin, RoleNames.restaurante].includes(
                data?.validar_codigo_huella_autorizacion.usuario?.roles?.[0].nombre as RoleNames
            )
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
            setIsConfirmLockLoading(false)
            return
        }

        bloquearMesa({
            variables: {
                updateMesaInput: {
                    mesa_id: mesa.mesa_id,
                    motivo_bloqueo: values.motivo_bloqueo,
                    estado: EstadoMesa.Bloqueada,
                    usuario_modifico_id: usuario_id,
                },
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Área bloqueada",
                    status: "success",
                    text: `**Mesa ${mesa.numero_mesa}** fue bloqueada por **${values.motivo_bloqueo}.**`,
                })
                dispatchResults()
            })
            .catch((e) => {
                showSnackbar({
                    title: "Error al bloquear área",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
            .finally(() => {
                setIsConfirmLockLoading(false)
            })
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
                            <span className="modal-lock-room__title modal-lock-room__text">Bloquear</span>
                            <span className="modal-lock-room__description modal-lock-room__text">
                                Mesa {mesa.numero_mesa}
                            </span>
                        </div>
                    </div>
                    <Controller
                        control={control}
                        name={"motivo_bloqueo"}
                        rules={{ required: !template_sample }}
                        render={({ field: { value, onChange } }) => (
                            <Dropdown
                                icon="userFilled"
                                errorHintText={errors.motivo_bloqueo ? "Selecciona un motivo de bloqueo" : undefined}
                                value={value}
                                label="Motivo"
                                className="modal-lock-mesa__motivo-bloqueo"
                                placeholder="Selecciona una opción"
                                onClick={(value) => {
                                    onChange(value.value)
                                }}
                                options={motivosBloqueoMesa?.map((m) => {
                                    return {
                                        value: m,
                                        label: m,
                                    }
                                })}
                            />
                        )}
                    />
                    {rolName !== RoleNames.admin && rolName !== RoleNames.superadmin && (
                        <Controller
                            control={control}
                            name={"codigo"}
                            rules={{ required: !template_sample, minLength: 4 }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputVerification
                                    className="modal-lock-room__input-veification"
                                    label="Código de autorización o huella dactilar para bloqueo"
                                    value={value}
                                    onChange={(value) => {
                                        onChange(value)
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
                    )}
                </div>
                <PrimaryButton text={"Bloquear"} type="submit" />
            </form>
        </Modal>
    )
}

export default LockTableModal
