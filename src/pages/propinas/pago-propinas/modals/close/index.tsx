import { useState } from "react"
import { useReiniciarAsignacionesPropinasMutation } from "src/gql/schema"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button } from "src/shared/components/forms"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useSnackbar from "src/shared/hooks/useSnackbar"
import "./index.css"

function ModalClose({ visible = false, onClose, onConfirm }): JSX.Element {
    const [loader, setLoader] = useState<boolean>(false)
    const [reiniciarAsignaciones] = useReiniciarAsignacionesPropinasMutation()
    const { showSnackbar } = useSnackbar()

    const hanldeConfirm = () => {
        setLoader(true)
        reiniciarAsignaciones()
            .then(() => {
                onConfirm()
            })
            .catch((e) => {
                showSnackbar({ title: "Error al ajustar propina", status: "error" })
                console.log(e)
            })
            .finally(() => {
                setLoader(false)
                onClose()
            })
    }

    return (
        <>
            <Modal
                className="propinas__close-modal"
                style={{ padding: "24px 30px" }}
                height={230}
                isOpen={visible}
                withCloseButton
                onClose={onClose}
            >
                <div className="propinas__close-modal__icon__contain">
                    <div className="propinas__close-modal__icon">
                        <span>{"!"}</span>
                    </div>
                </div>
                <h5 className="propinas__close-modal__title">{`¿Deseas abandonar el pago de propinas?`}</h5>
                <p className="propinas__close-modal__text">
                    {"Ningún pago será realizado y los ajustes de propina no serán aplicados"}
                </p>
                <div className="propinas__close-modal__buttons">
                    <Button
                        className="propinas__close-modal__btn"
                        text="Continuar con pago"
                        theme={"secondary"}
                        onClick={onClose}
                    />
                    <Button className="propinas__close-modal__btn" text="Salir" onClick={hanldeConfirm} />
                </div>
            </Modal>
            <LoaderComponent visible={loader} />
        </>
    )
}

export default ModalClose
