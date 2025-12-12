import React from "react"
import { Controller, useForm } from "react-hook-form"
import { Button, TextBox } from "src/shared/components/forms"
import { Modal } from "src/shared/components/layout/modal/Modal"
import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"
import "./Recepcion.css"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { Fajilla, useAutorizarFajillaMutation, useRechazarFajillaMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { formatCurrency } from "src/shared/hooks/formatCurrency"

interface FormCrearFajilla {
    comentarios: string
}
const defaultValues: FormCrearFajilla = {
    comentarios: "",
}
const RecepcionFajillas = ({
    addFajilla,
    setAddFajilla,
    fajilla,
    onConfirm,
}: {
    addFajilla: boolean
    setAddFajilla: React.Dispatch<React.SetStateAction<boolean>>
    fajilla: Fajilla
    onConfirm: () => void
}) => {
    const {
        control,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm<FormCrearFajilla>({
        defaultValues,
    })
    const { showSnackbar } = useSnackbar()

    const { usuario_id } = useProfile()

    const [autorizarFajilla] = useAutorizarFajillaMutation()
    const [rechazarFajilla] = useRechazarFajillaMutation()

    const onSubmit = (data: FormCrearFajilla) => {
        setAddFajilla(false)
    }

    const handleAutorizarFajilla = () => {
        autorizarFajilla({
            variables: {
                dataAutorizar: {
                    fajilla_id: fajilla.fajilla_id,
                    usuario_id,
                    ...(getValues("comentarios") ? { comentario: getValues("comentarios") } : {}),
                },
            },
        })
            .then(() => {
                reset(defaultValues)
                showSnackbar({
                    title: "Retiro de efectivo autorizado",
                    status: "success",
                    text: `Se autorizó el **retiro de efectivo ${fajilla.folio}** exitosamente`,
                })
                onConfirm()
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al autorizar el retiro de efectivo",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
            })
    }

    const handleRechazarFajilla = () => {
        rechazarFajilla({
            variables: {
                dataRechazar: {
                    fajilla_id: fajilla.fajilla_id,
                    usuario_id,
                    ...(getValues("comentarios") ? { comentario: getValues("comentarios") } : {}),
                },
            },
        })
            .then(() => {
                reset(defaultValues)
                showSnackbar({
                    title: "Retiro de efectivo rechazado",
                    status: "success",
                    text: `Se rechazó el **retiro de efectivo ${fajilla.folio}** exitosamente`,
                })
                onConfirm()
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al rechazar el retiro de efectivo",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
            })
    }

    return (
        <Modal
            isOpen={addFajilla}
            onClose={() => {
                reset(defaultValues)
                setAddFajilla(false)
            }}
            width={450}
            withCloseButton
            isCancelableOnClickOutside={false}
            className="cortes-modal-recepcion"
        >
            <HeaderIcon title={`Recibir retiro de efectivo`} icon="coinsFill" />
            <h3 className="form-add-fajilla__title">
                Monto: <p>{formatCurrency(fajilla?.monto || 0)}</p>
            </h3>
            <p className="modal-recepcion-subtitle">
                Al registrar el retiro de efectivo, confirmas que la cantidad mencionada ha sido entregada correctamente
            </p>
            <form className="form-add-fajilla" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="comentarios"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <TextBox
                            placeholder="Ej. 10 billetes de 200"
                            style={{ width: "100%" }}
                            onChange={(value) => onChange(value)}
                            value={value}
                            error={!!errors.comentarios}
                            description="Comentario"
                            errorHintText={errors.comentarios ? "Ingresa un comentario" : ""}
                        />
                    )}
                />
                <div className="modal-recepcion-buttons">
                    <Button
                        text="Rechazar"
                        type="submit"
                        theme="secondary"
                        onClick={() => handleRechazarFajilla()}
                    />
                    <Button text="Registrar" type="submit" onClick={() => handleAutorizarFajilla()} />
                </div>
            </form>
        </Modal>
    )
}

export default RecepcionFajillas
