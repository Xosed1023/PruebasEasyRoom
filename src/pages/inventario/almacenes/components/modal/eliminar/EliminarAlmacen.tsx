import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button } from "src/shared/components/forms"
import "./EliminarAlmacen.css"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useEliminarAlmacenMutation } from "src/gql/schema"

function EliminarAlmacen({ visible = false, onClose, idAlmacen, totalArticulos, values }): JSX.Element {
    const { showSnackbar } = useSnackbar()
    const [eliminarAlmacen] = useEliminarAlmacenMutation()

    const onSuccess = () => {
        eliminarAlmacen({
            variables: {
                deleteAlmacenInput: {
                    almacen_id: [idAlmacen],
                },
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Almacén eliminado",
                    status: "success",
                    text: `Se eliminó el almacén **"${values?.nombre}"** exitosamente.`,
                })

                onClose()
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al eliminar el almacén",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })

                onClose()
            })
    }

    return (
        <>
            <Modal
                className="eliminar-almacen__modal"
                height={230}
                isOpen={visible}
                withCloseButton
                onClose={onClose}
            >
                <div className="eliminar-almacen__modal__icon__contain">
                    <div className="eliminar-almacen__modal__icon">
                        <span>{"!"}</span>
                    </div>
                </div>
                <h5 className="eliminar-almacen__modal__title">
                    {totalArticulos > 0 ? "No se puede eliminar este almacén" : "¿Deseas eliminar este almacén?"}
                </h5>
                <p className="eliminar-almacen__modal__text">
                    {totalArticulos > 0
                        ? "Existen artículos o insumos asociados a este almacén. Para eliminarlo, primero debes mover los artículos a otro almacén o eliminarlos."
                        : "Al eliminar este almacén, dejará de estar disponible y no podrás almacenar artículos o insumos en él."}
                </p>
                <div className="modal--confirm__divider" />
                {totalArticulos > 0 ? (
                    <div className="eliminar-almacen__modal__buttons" style={{ width: "100%", display: "flex" }}>
                        <Button className="eliminar-almacen__modal__btn" text="Aceptar" onClick={onClose} />
                    </div>
                ) : (
                    <div className="eliminar-almacen__modal__buttons">
                        <Button
                            className="eliminar-almacen__modal__btn"
                            text="Cancelar"
                            theme={"secondary"}
                            onClick={onClose}
                        />
                        <Button
                            className="eliminar-almacen__modal__btn"
                            text="Eliminar"
                            onClick={() => {
                                onSuccess()
                            }}
                        />
                    </div>
                )}
            </Modal>
        </>
    )
}

export default EliminarAlmacen
