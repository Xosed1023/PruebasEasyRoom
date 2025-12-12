import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import { Modal, ModalProps } from "src/shared/components/layout/modal/Modal"
import Icon from "src/shared/icons"
import { PrimaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import { Controller, useForm } from "react-hook-form"
import InputVerification from "src/shared/components/forms/input-verification/InputVerification"
import { useEffect } from "react"
import "./DeletePropina.css"
import { client } from "src/graphql"
import { ELIMINAR_PROPINA } from "../add-propina/propina"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import useFingerprint from "src/shared/hooks/useFingerprint"
import { UareUFingerprintSample } from "src/shared/classes/fingerprint/UareU/interfaces/UareU.interface"
import useLoadingState from "src/shared/hooks/useLoadingState"

const defaultValues = {
    codigo: "",
    template_sample: "",
}

interface LockRoomProps extends ModalProps {
    refetch: () => void
    idPropina: string
}

const DeletePropina = ({ isOpen, onClose, idPropina, refetch }: LockRoomProps) => {
    const { control, handleSubmit, clearErrors, reset, watch, setValue, getValues } = useForm({ defaultValues })
    const { showSnackbar } = useSnackbar()
    const { isLoadingDelayed, toggleIsLoading } = useLoadingState()
    const template_sample = watch("template_sample")
    const codigo = watch("codigo")

    useEffect(() => {
        if (isOpen) reset({ codigo: "" })
    }, [isOpen])

    const onAcquisition = (fingerprint: UareUFingerprintSample) => {
        setValue("template_sample", JSON.parse(fingerprint.samples)[0]?.Data)
        setValue("codigo", "")
    }
    
    useEffect(() => {
        if(template_sample) {
            onSubmit(getValues())
        }
    }, [template_sample])
    
    
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

    const onSubmit = async (values: any) => {
        if (isLoadingDelayed) {
            return
        }
        toggleIsLoading({ value: true })
        const variables = {
            propina_id: idPropina,
        }

        try {
            const { data } = await client.mutate({
                mutation: ELIMINAR_PROPINA,
                variables: {
                    DeletePropinaInput: variables,
                    codigo: values.codigo,
                    template_sample: values.template_sample,
                },
            })

            if (data) {
                refetch()
                showSnackbar({
                    title: "Propina eliminada",
                    text: `Se eliminó una propina de ${formatCurrency(data?.eliminar_propina?.total)}`,
                    status: "success",
                })
                onClose?.()
            } else {
                showSnackbar({
                    title: "Error al eliminar propina",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            }
            toggleIsLoading({ value: false })
        } catch (e) {
            console.log("error, ", e)
            showSnackbar({
                title: "Error al eliminar propina",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                status: "error",
            })
            toggleIsLoading({ value: false })
        }
    }

    return (
        <Modal
            className="modal-delete-propina"
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
                            primaryBgDiameter={40}
                        >
                            <Icon name={"Warning"} height={18} width={18} color={"var(--white)"}></Icon>
                        </IconBorder>
                        <div className="modal-lock-room__head">
                            <span className="modal-lock-room__title modal-lock-room__text">Eliminar propina</span>
                        </div>
                    </div>
                    <p className="modal-delete-propina__subtitle">
                        Para poder eliminar esta propina necesitas agregar el código de verificación
                    </p>
                    <Controller
                        control={control}
                        name={"codigo"}
                        rules={{ required: !template_sample, minLength: 4 }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <InputVerification
                                className="modal-lock-room__input-veification"
                                label="Código de autorización o huella dactilar"
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
                <PrimaryButton disabled={isLoadingDelayed || !(template_sample || codigo)} text={"Eliminar propina"} type="submit" />
            </form>
        </Modal>
    )
}

export default DeletePropina
