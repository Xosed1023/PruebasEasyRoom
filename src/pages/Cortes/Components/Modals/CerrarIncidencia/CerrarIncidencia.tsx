import { useEffect, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { Button, TextBox } from "src/shared/components/forms"
import { Modal } from "src/shared/components/layout/modal/Modal"
import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import { GET_COLABORADORES } from "src/pages/incidencias/incidencias-graphql/queries/hotel-colaboradores"
import { useQuery } from "@apollo/client"
import { useProfile } from "src/shared/hooks/useProfile"
import userFilled from "src/shared/icons/UserFilled"
import { client } from "src/graphql"
import { CERRAR_INCIDENCIA } from "src/pages/incidencias/incidencias-graphql/mutations/incidencia"
import useSnackbar from "src/shared/hooks/useSnackbar"

interface FormCrearFajilla {
    name: string
    comentarios: string
}

const defaultValues: FormCrearFajilla = {
    name: "",
    comentarios: "",
}

const CerrarIncidencia = ({
    visible = false,
    onClose,
    onConfirm,
    incident,
}: {
    visible: boolean
    incident: any
    onClose: () => void
    onConfirm: () => void
}) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormCrearFajilla>({
        defaultValues,
    })
    const { hotel_id } = useProfile()
    const { showSnackbar } = useSnackbar()

    const [names, setNames] = useState([])
    const { data: colaboradores, error: errorNames } = useQuery(GET_COLABORADORES, {
        variables: {
            hotel_id,
        },
    })

    useEffect(() => {
        if (visible) reset({})
    }, [visible])

    useEffect(() => {
        const optionsNames = colaboradores?.hotel_colaboradores.map(
            ({ colaborador }: any) =>
                colaborador.nombre + " " + colaborador.apellido_paterno + " " + colaborador.apellido_materno
        )
        if (!errorNames) setNames(optionsNames?.sort())
    }, [colaboradores])

    const nameSelected = useWatch({ control, name: "name" })

    const searchColaboradorSelected = () => {
        const colaborador = colaboradores?.hotel_colaboradores.filter(({ colaborador }: any) => {
            const nameArray =
                colaborador.nombre + " " + colaborador.apellido_paterno + " " + colaborador.apellido_materno
            if (nameArray === nameSelected) return colaborador
        })
        return colaborador
    }

    const onSubmit = async (data: FormCrearFajilla) => {
        const closeIncidenciaInput = {
            colaborador_id_cierra: searchColaboradorSelected()[0].colaborador_id,
            comentario_cierre: data.comentarios,
            incidencia_id: incident?.incidencia_id,
        }

        try {
            const { data } = await client.mutate({ mutation: CERRAR_INCIDENCIA, variables: { closeIncidenciaInput } })
            if (data?.cerrar_incidencia?.incidencia_id) {
                showSnackbar({
                    title: "Incidencia cerrada",
                    text: `Se cerró una incidencia con el folio **${incident?.folio}**.`,
                    status: "success",
                })
                onConfirm()
            } else {
                showSnackbar({
                    title: "Error al cerrar incidencia",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            }
        } catch (err) {
            showSnackbar({
                title: "Error al cerrar incidencia",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                status: "error",
            })
            console.log(err)
        }

        onClose()
    }
    return (
        <Modal
            isOpen={visible}
            onClose={onClose}
            width={400}
            withCloseButton
            isCancelableOnClickOutside={false}
            className="cortes-modal-cerrar-incidencia"
        >
            <HeaderIcon title="Cerrar incidencia" icon="alertFill" />
            <form className="form-add-fajilla" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                        <InputTextSuggestions
                            suggestionsListWidth="400px"
                            suggestions={names || ["-"]}
                            value={value}
                            inputTextConfig={{
                                label: "Nombre de quien cierra la incidencia",
                                placeholder: "Agrega el nombre del personal",
                                type: "text",
                                icon: userFilled,
                                errorhinttext: errors.name ? "Escribe un nombre" : "",
                                error: errors.name ? true : false,
                                className: "registro-incidencia__input-text",
                            }}
                            onChange={(data) => {
                                onChange(data)
                            }}
                        />
                    )}
                />
                <Controller
                    name="comentarios"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <TextBox
                            placeholder="Escribe algo..."
                            style={{ width: "100%" }}
                            onChange={(value) => onChange(value)}
                            value={value}
                            error={!!errors.comentarios}
                            description="Comentario de cierre (opcional)"
                            errorHintText={errors.comentarios ? "Ingresa un comentario" : ""}
                        />
                    )}
                />
                <Button text="Cerrar incidencia" type="submit" style={{ width: "100%" }} />
            </form>
        </Modal>
    )
}

export default CerrarIncidencia
