import { Modal, ModalProps } from "src/shared/components/layout/modal/Modal"
import "./CancelarReserva.css"
import { PrimaryButton } from "../../sections/elements/Elements"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import { useForm, Controller } from "react-hook-form"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import InputVerification from "src/shared/components/forms/input-verification/InputVerification"
import { TextBox } from "src/shared/components/forms"
import { useRoom } from "../../hooks"
import { optionsWithOTA, optionsWithoutOTA } from "./CancelarReserva.constants"
import useFingerprint from "src/shared/hooks/useFingerprint"
import { useEffect } from "react"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { UareUFingerprintSample } from "src/shared/classes/fingerprint/UareU/interfaces/UareU.interface"
import useLoadingState from "src/shared/hooks/useLoadingState"
import { useProfile } from "src/shared/hooks/useProfile"
import { RoleNames } from "src/shared/hooks/useAuth"

export interface CancelReservaData {
    codigo: string,
    template_sample: string
    presupuesto: number
    otroMotivoCancelacion: string
    motivoCancelacion
}

interface CancelarReservaProps extends ModalProps {
    onConfirm: (data: CancelReservaData, cb?: () => void) => void
    onCancelError?: () => void
    title?: string
    subtitle?: string
    ota?: boolean
}

const CancelarReserva = ({
    onClose,
    isOpen,
    onConfirm,
    onCancelError,
    title = "Cancelar habitación",
    subtitle,
    ota = false,
}: CancelarReservaProps) => {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
        clearErrors,
        getValues,
        setValue,
        trigger,
    } = useForm()

    const motivoCancelacion = watch("motivoCancelacion")
    const room = useRoom()
    const { rolName } = useProfile()
    const { showSnackbar } = useSnackbar()
    const { isLoadingDelayed, toggleIsLoading } = useLoadingState()
    const template_sample = watch("template_sample")
    const codigo = watch("codigo")

    const onSubmit = (data) => {
        if (isLoadingDelayed) {
            return
        }
        toggleIsLoading({ value: true })
        reset()
        onConfirm(data, () => toggleIsLoading({ value: false }))
        onClose?.()
    }

    const onAcquisition = (fingerprint: UareUFingerprintSample) => {
        if (!isOpen) {
            return
        }
        if (!getValues().motivoCancelacion) {
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
            className="modal__cancelar-renta-reserva"
            withCloseButton
            height={"fit-content"}
            isOpen={isOpen}
            isCancelableOnClickOutside={false}
            onClose={() => {
                onClose?.(), reset()
            }}
        >
            <form className="modal__cancelar-renta-reserva__form" onSubmit={handleSubmit(onSubmit)}>
                <div className="modal__cancelar-renta-reserva__wrapper">
                    <IconBorder primaryBgColor="var(--ocupada-card-1)" primaryBgDiameter={60}>
                        <Icon name="ExclamationFilled" color="var(--pink-ocupado)" height={30} width={30} />
                    </IconBorder>
                    <span className="modal__cancelar-renta-reserva__title">{title}</span>
                    <span className="modal__cancelar-renta-reserva__subtitle">{subtitle}</span>
                    <Controller
                        name="motivoCancelacion"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <div className="modal__cancelar-renta-reserva__card__input__wrapper">
                                <Dropdown
                                    value={value}
                                    options={ota ? optionsWithOTA : optionsWithoutOTA}
                                    icon="DocumentExcelFilled"
                                    placeholder="Selecciona una opción"
                                    onClick={(data) => onChange(data.value)}
                                    label={"Motivo de cancelación"}
                                    className="modal__cancelar-renta-reserva__card__input"
                                    errorHintText={errors.motivoCancelacion ? "Selecciona un método de pago" : ""}
                                />
                            </div>
                        )}
                    />
                    {motivoCancelacion === "Otro" && (
                        <Controller
                            name="otroMotivoCancelacion"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <TextBox
                                    characterLimit={40}
                                    onChange={onChange}
                                    value={value}
                                    description="Escribe el motivo de la cancelación"
                                    placeholder="Escribe un comentario"
                                    style={{ height: "68px" }}
                                    className="modal__cancelar-renta-reserva__text-area"
                                    error={error?.type === "required"}
                                    errorHintText={error?.type === "required" ? "El comentario es requerido" : ""}
                                />
                            )}
                        />
                    )}
                    {rolName !== RoleNames.admin && (
                        <Controller
                            control={control}
                            name={"codigo"}
                            rules={{ required: !template_sample }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputVerification
                                    className="modal__cancelar-renta-reserva__input-verification"
                                    label="Código de verificación"
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
                <PrimaryButton
                    disabled={isLoadingDelayed}
                    type="submit"
                    text={!room?.folioRenta ? "Cancelar reserva" : "Cancelar habitación"}
                />
            </form>
        </Modal>
    )
}

export default CancelarReserva
