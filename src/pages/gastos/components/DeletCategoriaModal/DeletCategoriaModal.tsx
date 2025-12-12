import { useDeleteCategoriaGastosMutation } from "src/gql/schema"
import { Button } from "src/shared/components/forms"
import { ModalConfirm } from "src/shared/components/layout"
//import { ModalConfirm } from "src/shared/components/layout/modal-confirm/ModalConfirm"
import { Modal } from "src/shared/components/layout/modal/Modal"
import Icon from "src/shared/icons"
interface DelateCategoriaModalProps {
    onSub: (value: { texto: string; success: boolean }) => void
    onClose: () => void
    id: string
    title: string
    presupuesto: string
    open: boolean
}
export const DeletCategoriaModal = ({ id, onSub, onClose, title, presupuesto, open }: DelateCategoriaModalProps) => {
    //const [deleteCategoria] = useDeleteCategoriaGastosMutation()

    const onDelete = () => {
        onClose
    }
    return (
        <Modal isOpen={open} onClose={onClose} className="delete_categoria_modal" withCloseButton>
            <div className="modal--confirm__header">
                <div className={`modal--confirm__icon`}>
                    <Icon name="Warning" color="var(--pink-ocupado)" />
                </div>
                <span className="modal--confirm__title">{`¿Deseas eliminar esta categoria?`}</span>
                <span className="modal--confirm__description">{`Al eliminar esta categoria ya no podrás agregar más gastos, pero aún podrás revisarlos en el historial.`}</span>
            </div>
            <div className="modal--confirm__divider"></div>
            <div className="modal--confirm__footer">
                <Button type={"button"} text={"Cancelar"} theme={"secondary"} onClick={onClose} />
                <Button type={"button"} text={"Confirmar"} theme={"primary"} onClick={onDelete} />
            </div>
        </Modal>
    )
}

export function ModalDeleteCat({
    id,
    onSub,
    onClose,
    title,
    presupuesto,
    open,
}: {
    onSub: (value: { texto: string; success: boolean }) => void
    onClose: () => void
    id: string
    title: string
    presupuesto: string
    open: boolean
}) {
    const [deleteCategoria] = useDeleteCategoriaGastosMutation()
    const handleRemove = () => {
        let toastText: {
            texto: string
            success: boolean
        } = {
            texto: "",
            success: false,
        }

        deleteCategoria({
            variables: {
                deleteGastoCatergoria: {
                    categoria_id: id,
                },
            },
        })
            .then(() => {
                toastText = {
                    texto:
                        "Se elimino la categoría de " +
                        title +
                        " con un presupuesto mensual de $" +
                        presupuesto +
                        " exitosamente.",
                    success: true,
                }
                onSub(toastText)
            })
            .catch((err) => {
                toastText = {
                    texto: "Error al eliminar la categoría" + err,
                    success: false,
                }
                onSub(toastText)
            })
        onClose()
    }
    return (
        <ModalConfirm
            isOpen={open}
            className="delete-modal-gasto"
            title={"¿Deseas eliminar esta categoría?"}
            description={
                <p className="delete-modal-subtitle">
                    Al hacerlo,{" "}
                    <span className="delete-modal-subtitle-bold">no podrás crear nuevos gastos en esta categoría,</span>{" "}
                    pero podrás ver los gastos anteriores hasta la fecha de eliminación. Si registraste gastos este mes,
                    estarán en la carátula del mes en curso.
                </p>
            }
            icon={<Icon name="Warning" color="#EB5757" />}
            iconTheme="danger"
            onCloseDialog={({ confirmed }) => {
                if (confirmed) {
                    handleRemove()
                } else {
                    onClose()
                }
            }}
            confirmLabel="Eliminar"
        />
    )
}
