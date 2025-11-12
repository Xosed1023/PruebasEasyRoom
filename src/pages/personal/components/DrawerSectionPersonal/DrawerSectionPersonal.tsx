import { DrawerSectinProps } from "src/pages/reservaciones/inicio/Inicio.types"
import React, { useState } from "react"
import Avatar, { AvatarIconState, AvatarState } from "src/shared/components/data-display/avatar/avatar"
import Drawer from "src/shared/components/layout/drawer/Drawer"
import "./DrawerSectionPersonal.css"
import { formatDate } from "src/shared/helpers/formatDate"
import { Button } from "src/shared/components/forms"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toggleDrawer } from "src/store/navigation/navigationSlice"
import { RootState } from "src/store/store"
import { useDate } from "src/shared/hooks/useDate"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { ModalConfirm } from "src/shared/components/layout"
import Icon from "src/shared/icons"
import { useEliminarColaboradorMutation } from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"
import DrawerWrappper from "../DrawerWrapper/DrawerWrappper"
import profileDefault from "src/assets/webp/profile_default.webp"
import { setColaboradores, togglePersonalDrawer } from "src/store/personal/personal.slice"
import ModalDeleteDigitalAuth from "../ModalDeleteDigitalAuth/ModalDeleteDigitalAuth"

const DrawerSectionPersonal = ({ visible = false, onClose = undefined, onDelete }: DrawerSectinProps) => {
    const { colaboradorSelected, colaboradores } = useSelector((state: RootState) => state.personal)
    const { UTCStringToLocalDate } = useDate()
    const navigate = useNavigate()

    const [eliminarColaborador] = useEliminarColaboradorMutation()
    const { showSnackbar } = useSnackbar()
    const dispatch = useDispatch()
    function toggleDrawerState(value: boolean): void {
        dispatch(toggleDrawer(value))
    }

    const [isModalEliminarColaboradorOpen, setIsModalEliminarColaboradorOpen] = useState(false)
    const [isModalDeleteAuthOpen, setisModalDeleteAuthOpen] = useState<{
        isOpen: boolean
        mode: "PIN" | "PIN&FINGERPRINT"
    }>({ isOpen: false, mode: "PIN" })

    const handleOpenModal = () => {
        if (colaboradorSelected?.colaborador_in_hotel?.[0]?.puesto?.nombre === "Camarista") {
            return setisModalDeleteAuthOpen({ isOpen: true, mode: "PIN" })
        }
        setisModalDeleteAuthOpen({ isOpen: true, mode: "PIN&FINGERPRINT" })
    }

    return (
        <Drawer placement={"right"} bar={false} visible={visible} withCloseButton={true} onClose={onClose}>
            <>
                <DrawerWrappper className="drawerPersonal-wrapper">
                    <div className="drawerPersonal-title">
                        <Avatar
                            src={colaboradorSelected?.foto || profileDefault}
                            size={"xl"}
                            state={AvatarState.Loaded}
                            avatarIconState={AvatarIconState.online}
                        />
                        <div className="drawerPersonal-title__title">
                            {`${colaboradorSelected?.nombre || ""} ${colaboradorSelected?.apellido_paterno || ""} ${
                                colaboradorSelected?.apellido_materno || ""
                            }`}
                        </div>
                        <div className="drawerPersonal-title__subtitle">{`${
                            colaboradorSelected?.colaborador_in_hotel?.[0]?.puesto?.nombre || ""
                        } ${colaboradorSelected?.numero_colaborador}`}</div>
                    </div>
                    <div className="drawerPersonal__container-info">
                        <DescriptionDetail icon={"calendar01"} label={"Turno"} value={"Matutino"} />
                        <DescriptionDetail
                            icon={"cake2fill"}
                            style={{
                                padding: "12px 0",
                            }}
                            label={"Fecha de cumpleaños"}
                            value={formatDate(UTCStringToLocalDate(colaboradorSelected?.fecha_cumpleanios))}
                        />

                        <DescriptionDetail icon={"CoinsFill"} label={"Sueldo"} value={"Sin asignar"} />
                        <DescriptionDetail
                            icon={"phone"}
                            style={{
                                padding: "12px 0",
                            }}
                            label={"Telefono Personal"}
                            value={colaboradorSelected?.telefono_personal || ""}
                        />
                        <DescriptionDetail
                            icon={"phonealertfill"}
                            style={{
                                padding: "12px 0",
                            }}
                            label={"Telefono de emergencias"}
                            value={colaboradorSelected?.telefono_emergencia || "N/A"}
                        />
                        <DescriptionDetail
                            icon={"mailFill"}
                            label={"Correo"}
                            style={{
                                padding: "12px 0",
                            }}
                            value={colaboradorSelected?.correo || ""}
                        />
                        <DescriptionDetail
                            icon={"home3fill"}
                            label={"Direccion"}
                            style={{
                                padding: "12px 0",
                            }}
                            value={colaboradorSelected?.direccion || ""}
                        />
                        {colaboradorSelected?.usuario?.tiene_huella && (
                            <div className="digitalAuthorization__container">
                                <DescriptionDetail
                                    icon={"FingerPrint"}
                                    label={"Autorizacion digital"}
                                    style={{
                                        padding: "12px 0",
                                    }}
                                    value={
                                        colaboradorSelected?.colaborador_in_hotel?.[0]?.puesto?.nombre === "Camarista"
                                            ? ["Pin Activo", "Huella dactilar activa"]
                                            : colaboradorSelected?.colaborador_in_hotel?.[0]?.puesto?.nombre ===
                                              "OtroPuesto"
                                            ? "Pin Activo"
                                            : "Huella dactilar activa"
                                    }
                                />
                                <span className="digitalAuthorization__delete-link" onClick={handleOpenModal}>
                                    Eliminar
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="drawerPersonal__divider"></div>
                    {!colaboradorSelected?.eliminado && (
                        <div className="drawerPersonal__buttons">
                            <Button
                                text="Editar perfil"
                                style={{ width: "90%" }}
                                theme="primary"
                                onClick={() => {
                                    onClose
                                    toggleDrawerState(true)
                                    navigate("/u/addPerson", { state: { colaboradorSelected } })
                                }}
                            />
                            <Button
                                text="Eliminar de personal"
                                style={{ width: "90%" }}
                                className="button-border"
                                onClick={() => {
                                    setIsModalEliminarColaboradorOpen(true)
                                }}
                            />
                        </div>
                    )}
                </DrawerWrappper>
                <ModalConfirm
                    isOpen={isModalEliminarColaboradorOpen}
                    icon={<Icon name="ExclamationFilled" color="var(--pink-ocupado)" height={24} width={24} />}
                    iconTheme="danger"
                    title="Eliminar personal"
                    description={`¿Deseas eliminar a ${colaboradorSelected?.nombre} ${colaboradorSelected?.apellido_paterno} ${colaboradorSelected?.apellido_materno} del personal? A partir de ahora no podrás asignar este perfil a ningún turno o habitación.`}
                    onCloseDialog={({ confirmed }) => {
                        setIsModalEliminarColaboradorOpen(false)
                        if (confirmed) {
                            eliminarColaborador({
                                variables: {
                                    colaborador: {
                                        colaborador_id: colaboradorSelected?.colaborador_id || "",
                                    },
                                },
                            })
                                .then(() => {
                                    dispatch(
                                        setColaboradores(
                                            colaboradores.filter(
                                                (c) => colaboradorSelected?.colaborador_id !== c.colaborador_id
                                            )
                                        )
                                    )
                                    dispatch(togglePersonalDrawer(false))
                                    showSnackbar({
                                        status: "success",
                                        title: "Perfil eliminado",
                                        text: `Eliminaste a **${colaboradorSelected?.nombre} ${colaboradorSelected?.apellido_paterno} ${colaboradorSelected?.apellido_materno}** de tu personal de ${colaboradorSelected?.colaborador_in_hotel?.[0]?.puesto?.nombre}s`,
                                    })
                                })
                                .catch(() => {
                                    dispatch(togglePersonalDrawer(false))
                                    showSnackbar({
                                        title: "Error al crear eliminar colaborador",
                                        status: "error",
                                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                                    })
                                })
                                .finally(() => {
                                    toggleDrawerState(false)
                                })
                        }
                    }}
                />

                <ModalDeleteDigitalAuth
                    isOpen={isModalDeleteAuthOpen.isOpen}
                    mode={isModalDeleteAuthOpen.mode}
                    onClose={() => setisModalDeleteAuthOpen((v) => ({ ...v, isOpen: false }))}
                    colaboradorSelected={colaboradorSelected}
                />
            </>
        </Drawer>
    )
}

export default DrawerSectionPersonal
