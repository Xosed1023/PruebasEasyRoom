import { Modal } from "src/shared/components/layout/modal/Modal"
import { Button } from "src/shared/components/forms"
import "./EliminarCategoria.css"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useEliminarCategoriaArticuloMutation } from "src/gql/schema"

function EliminarCategoria({ visible = false, onClose, categoria_id, nombre, onConfirm }): JSX.Element {
    const { showSnackbar } = useSnackbar()
    const [eliminarCategoria] = useEliminarCategoriaArticuloMutation()

    const onSuccess = () => {
        eliminarCategoria({
            variables: {
                datos_categoria: {
                    categoria_id: categoria_id,
                },
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Categoría eliminada",
                    status: "success",
                    text: `Se eliminó la categoría **"${nombre}"** exitosamente.`,
                })
                onConfirm()
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al eliminar la categoría",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
            }).finally(() => onClose())
    }

    return (
        <>
            <Modal
                className="eliminar-categoria__modal"
                height={230}
                isOpen={visible}
                withCloseButton
                onClose={onClose}
            >
                <div className="eliminar-categoria__modal__icon__contain">
                    <div className="eliminar-categoria__modal__icon">
                        <span>{"!"}</span>
                    </div>
                </div>
                <h5 className="eliminar-categoria__modal__title">¿Deseas eliminar esta categoría?</h5>
                <p className="eliminar-categoria__modal__text">
                    Los artículos que tienes a la venta bajo esta categoría dejarán de estar disponibles.
                </p>

                <div className="eliminar-categoria__modal__buttons">
                    <Button
                        className="eliminar-categoria__modal__btn"
                        text="Cancelar"
                        theme={"secondary"}
                        onClick={onClose}
                    />
                    <Button
                        className="eliminar-categoria__modal__btn"
                        text="Eliminar"
                        onClick={() => {
                            onSuccess()
                        }}
                    />
                </div>
            </Modal>
        </>
    )
}

export default EliminarCategoria
