import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { client } from "src/graphql"
import { GET_COLABORADORES } from "src/graphql/queries/colaboradores"
import { Button, TextBox } from "src/shared/components/forms"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import { Modal } from "src/shared/components/layout/modal/Modal"
import UserFilled from "src/shared/icons/UserFilled"
import { toggleDrawer } from "src/store/navigation/navigationSlice"
import { CERRAR_INCIDENCIA } from "../../incidencias-graphql/mutations/incidencia"
import { defaultValues } from "./DetalleIncidencia.constants"
import "./DetalleIncidencia.css"
import { FormValues } from "./DetalleIncidencia.types"
import useSnackbar from "src/shared/hooks/useSnackbar"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useLoadingState from "src/shared/hooks/useLoadingState"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { TiposIncidenciasFront } from "../../registro-incidencia/RegistroIncidencia.constants"
import { useProfile } from "src/shared/hooks/useProfile"

const ModalCerrarIncidencia = ({ visible = false, onClose, incidenciaId = "", onConfirm, folio, tipoIncidencia }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { hotel_id } = useProfile()
    const { showSnackbar } = useSnackbar()
    const { showMiniSnackbar } = useMiniSnackbar()
    const dispatch = useDispatch()
    const [names, setNames] = useState([])
    const { isLoading, toggleIsLoading } = useLoadingState()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        getValues,
    } = useForm<FormValues>({
        defaultValues,
    })

    useEffect(() => {
        visible === false ? reset() : null
    }, [visible])

    const nameSelected = useWatch({ control, name: "name" })

    const { data: colaboradores, error: errorNames } = useQuery(GET_COLABORADORES, {
        variables: { hotel_id },
    })

    useEffect(() => {
        const optionsNames = colaboradores?.colaboradores.map(
            (colaborador: any) =>
                colaborador.nombre + " " + colaborador.apellido_paterno + " " + colaborador.apellido_materno
        )
        if (!errorNames) setNames(optionsNames?.sort())
    }, [colaboradores])

    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { Modal: AuthModal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                isOpen={isAuthModalOpen}
                onAuthFilled={() => {
                    confirmCancel(getValues())
                }}
                onClose={() => setisAuthModalOpen(false)}
                authorizedPins={
                    tipoIncidencia === TiposIncidenciasFront.ObjetoOlvidado
                        ? [RoleNames.admin, RoleNames.superadmin]
                        : [RoleNames.admin, RoleNames.superadmin, RoleNames.recepcionista]
                }
                authorizedRoles={[RoleNames.admin, RoleNames.superadmin, RoleNames.recepcionista]}
            />
        ),
        authorizedRoles: [RoleNames.admin, RoleNames.recepcionista, RoleNames.superadmin],
        isOpen: isAuthModalOpen,
        noNeedAuthModalRoles:
            tipoIncidencia === TiposIncidenciasFront.ObjetoOlvidado
                ? [RoleNames.admin, RoleNames.superadmin]
                : [TiposIncidenciasFront.Limpieza, TiposIncidenciasFront.Mantenimiento].includes(tipoIncidencia)
                ? [RoleNames.admin, RoleNames.recepcionista, RoleNames.superadmin]
                : [RoleNames.admin, RoleNames.superadmin],
        onClose: () => setisAuthModalOpen(false),
    })

    const confirmCancel = async (data: FormValues) => {
        if (isLoading) {
            return
        }
        toggleIsLoading({ value: true })
        const closeIncidenciaInput = {
            colaborador_id_cierra: searchColaboradorSelected()[0].colaborador_id,
            comentario_cierre: data.comment || null,
            incidencia_id: incidenciaId,
            hotel_id,
        }
        try {
            const { data } = await client.mutate({ mutation: CERRAR_INCIDENCIA, variables: { closeIncidenciaInput } })
            if (data) {
                showSnackbar({
                    title: "Incidencia cerrada",
                    text: `Se cerró la incidencia con el **folio ${data.cerrar_incidencia?.folio}** exitosamente`,
                    status: "success",
                })
            }
        } catch (err) {
            showMiniSnackbar({
                title: "Error al cerrar incidencia",
                text: `¡Ups! Ocurrió un eror al **cerrar** la incidencia con **folio ${folio}`,
                status: "error",
            })
        } finally {
            toggleIsLoading({ value: false })
        }

        dispatch(toggleDrawer(false))
        setisAuthModalOpen(false)
        onClose?.()
        reset(defaultValues)
        onConfirm()
        if (location.pathname.split("/")?.[2] === "incidencias") navigate("/u/incidencias")
    }

    const onSubmit = async (data: FormValues) => {
        skip ? confirmCancel(data) : setisAuthModalOpen(true)
    }

    const searchColaboradorSelected = () => {
        const colaborador = colaboradores?.colaboradores.filter((colaborador: any) => {
            const nameArray =
                colaborador.nombre + " " + colaborador.apellido_paterno + " " + colaborador.apellido_materno
            if (nameArray === nameSelected) return colaborador
        })
        return colaborador
    }

    return (
        <>
            <Modal
                className="detalle-incidencia__modal"
                isOpen={visible}
                withCloseButton
                onClose={onClose}
                isCancelableOnClickOutside={false}
            >
                <div className="detalle-incidencia__modal__title">
                    <IconBorder primaryBgColor="var(--fondo-close)" primaryBgDiameter={60}>
                        <Icon color="var(--primary)" name="alertFill" width={25} height={25} />
                    </IconBorder>
                    <h2>Cerrar incidencia</h2>
                </div>

                <form className="detalle-incidencia__modal__form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="detalle-incidencia__modal__inputs">
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <InputTextSuggestions
                                    suggestionsListWidth="512px"
                                    suggestions={names || ["-"]}
                                    value={value}
                                    inputTextConfig={{
                                        style: { width: "100%" },
                                        label: "Nombre de quien cierra la incidencia",
                                        placeholder: "Escribe un nombre",
                                        type: "text",
                                        icon: UserFilled,
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
                            name="comment"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <TextBox
                                    className="registro-incidencia__textarea"
                                    placeholder={"Escribe algo..."}
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    description={"Comentario de cierre"}
                                    errorHintText="Escribe un comentario de cierre"
                                    error={errors.comment ? true : false}
                                />
                            )}
                        />
                    </div>
                    <Button className="detalle-incidencia__button" type={"submit"} text={"Cerrar incidencia"} />
                </form>
            </Modal>
            {AuthModal}
        </>
    )
}

export default ModalCerrarIncidencia
