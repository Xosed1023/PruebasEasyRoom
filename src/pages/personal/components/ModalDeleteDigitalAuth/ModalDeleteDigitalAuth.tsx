import React, { useState } from "react"

import "./ModalDeleteDigitalAuth.css"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { ModalConfirm } from "src/shared/components/layout"
import Icon from "src/shared/icons"
import OptionSelector from "src/shared/components/data-display/optionSelector/OptionSelector"
import { Colaborador, useEliminar_HuellaMutation } from "src/gql/schema"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import useLoadingState from "src/shared/hooks/useLoadingState"
import { useDispatch } from "react-redux"
import { selectColaborador } from "src/store/personal/personal.slice"

const ModalDeleteDigitalAuth = ({
    isOpen,
    mode,
    onClose,
    colaboradorSelected,
}: {
    isOpen: boolean
    mode: "PIN" | "PIN&FINGERPRINT"
    onClose: () => void
    colaboradorSelected?: Colaborador
}) => {
    const { showMiniSnackbar } = useMiniSnackbar()
    const dispatch = useDispatch()

    const options_delete = [
        { label: "Eliminar huella dactilar", value: "fingerprint" },
        { label: "Eliminar PIN y huella dactilar", value: "pin_and_fingerprint" },
    ]

    const [eliminarHuella] = useEliminar_HuellaMutation()
    const {isLoading, isLoadingDelayed, toggleIsLoading} = useLoadingState()

    const [selectedOption, setSelectedOption] = useState<"fingerprint" | "pin_and_fingerprint">("fingerprint")

    const handleOptionChange = (value: "fingerprint" | "pin_and_fingerprint") => {
        setSelectedOption(value)
    }

    const handleDelete = () => {
        console.log(isLoading);
        
        if(isLoading) {
            return
        }
        toggleIsLoading({value: true})
        if (selectedOption === "fingerprint") {
            eliminarHuella({
                variables: {
                    input: {
                        usuario_id: colaboradorSelected?.usuario_id || "",
                    },
                },
            })
                .then(() => {
                    showMiniSnackbar({
                        status: "success",
                        title: "Autorización digital eliminada",
                        text: "Se eliminó la autorización digital para este colaborador.",
                    })
                })
                .catch(() => {
                    showMiniSnackbar({
                        title: "Error al eliminar autorización digital",
                        status: "error",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    })
                })
                .finally(() => {
                    toggleIsLoading({value: false})
                    onClose()
                    dispatch(selectColaborador({...colaboradorSelected, usuario: {...colaboradorSelected?.usuario, tiene_huella: false}}))
                })
        }
        // todo pin_and_fingerprint
    }

    const handleDeletePIN = () => {
        // todo pin
        try {
            showMiniSnackbar({
                status: "success",
                title: "Autorización digital eliminada",
                text: "Se eliminó la autorización digital para este colaborador.",
            })
        } catch (error) {
            showMiniSnackbar({
                title: "Error al eliminar autorización digital",
                status: "error",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
            })
        }
        onClose()
    }

    return (
        <>
            <ModalConfirm
                isOpen={isOpen && mode === "PIN"}
                icon={<Icon name="ExclamationFilled" color="var(--pink-ocupado)" height={24} width={24} />}
                iconTheme="danger"
                title="Eliminar autorización con PIN"
                description={
                    <>
                        {" "}
                        Al eliminar el PIN,{" "}
                        <strong>{`${colaboradorSelected?.nombre} ${colaboradorSelected?.apellido_paterno} ${colaboradorSelected?.apellido_materno}`}</strong>{" "}
                        no podrá autorizar operaciones diarias de manera rápida y sencilla. Puedes agregarlo nuevamente
                        desde el perfil de colaborador.
                    </>
                }
                onCloseDialog={({ confirmed }) => {
                    if (confirmed) {
                        handleDeletePIN()
                    }
                }}
            />
            <Modal isOpen={isOpen && mode === "PIN&FINGERPRINT"} withCloseButton={true} onClose={onClose} width="572px">
                <div className="modal-content">
                    <div className="modal-content__general">
                        <div className="modal-content__header">
                            <div className="modal-content__icon-outer-delete">
                                <div className="modal-content__icon-delete">
                                    <Icon
                                        name="ExclamationFilled"
                                        color="var(--pink-ocupado) "
                                        height={20}
                                        width={20}
                                    />
                                </div>
                            </div>
                        </div>
                        <h2 className="modal-content__title-delete">Eliminar autorización digital</h2>
                        <p className="modal-content__description-delete">
                            Selecciona la opción más conveniente, al eliminar la autorización para{" "}
                            <strong>{`${colaboradorSelected?.nombre} ${colaboradorSelected?.apellido_paterno} ${colaboradorSelected?.apellido_materno}`}</strong>{" "}
                            no podrá autorizar operaciones diarias de manera rápida y sencilla.
                        </p>
                        <div className="modal-content__option-delete">
                            <OptionSelector
                                options={options_delete}
                                selectedOption={selectedOption}
                                onOptionChange={(v) => handleOptionChange(v as "fingerprint" | "pin_and_fingerprint")}
                            />
                        </div>
                        <p className="modal-content__footer-text-delete">
                            Puedes agregar la autorización nuevamente desde el perfil del colaborador.
                        </p>
                        <div className="modal-content__divider"></div>
                        <button disabled={isLoadingDelayed} onClick={handleDelete} className="modal-content__action-button">
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ModalDeleteDigitalAuth
