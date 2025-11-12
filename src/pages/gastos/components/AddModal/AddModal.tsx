import { useForm, Controller } from "react-hook-form"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { InputText } from "src/shared/components/forms"
import { Button } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import "./AddModal.css"
import billFill from "src/shared/icons/billFill"
import { CrearCategoriaGastoMutationVariables, useCrearCategoriaGastoMutation } from "src/gql/schema"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import { useProfile } from "src/shared/hooks/useProfile"

interface addCategoriaProps {
    onSub: (sedText: { texto: string; success: boolean }) => void
    onClose: () => void
    isOpen: boolean
}

export const AddModal = ({ onSub, onClose, isOpen }: addCategoriaProps) => {
    const [crearGastosMutation] = useCrearCategoriaGastoMutation()

    const { hotel_id, usuario_id } = useProfile()
    const defaultValues: any = {
        categoria: "",
        hotel_id: hotel_id,
        usuario_id: usuario_id,
        presupuesto: 0,
        limite_mensual: 0,
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues })

    const onSubmit = (data: CrearCategoriaGastoMutationVariables["crearCategoriaGasto"]) => {
        data = { ...data, presupuesto: data.limite_mensual }
        let sedText: {
            texto: string
            success: boolean
        } = {
            texto: "",
            success: false,
        }

        crearGastosMutation({ variables: { crearCategoriaGasto: data } })
            .then(() => {
                sedText = {
                    texto: `La categoría ${data.categoria} ha sido creada exitosamente.`,
                    success: true,
                }
                onSub(sedText)
                onClose
            })
            .catch(() => {
                sedText = {
                    texto: `Ha ocurrido un error al crear la categoría ${data.categoria}`,
                    success: false,
                }
                onSub(sedText)
                onClose
            })
    }
    return (
        <>
            <Modal
                className="gasto-add-modal"
                isOpen={isOpen}
                withCloseButton
                onClose={onClose}
                isCancelableOnClickOutside={false}
            >
                <div className="gasto-add-modal-icon">
                    <Icon name="docDraft" />
                </div>
                <h2 className="gasto-add-modal-title">Crear nueva categoría</h2>
                <p className="gasto-add-modal-subtitle">Podrás borrar y crear subcategorías en cualquier momento</p>
                <form className="gasto-add-modal-form" onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name={"categoria"}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                            <InputText
                                error={errors.categoria ? true : false}
                                errorhinttext={errors.categoria ? "Ingresa un nombre" : undefined}
                                className={"gasto-add-modal-form-input"}
                                label={"Nombre de categoría"}
                                type={"text"}
                                maxLength={32}
                                placeholder={"Escribe nombre"}
                                value={value}
                                onChange={(e) => {
                                    onChange(e.target.value)
                                }}
                                icon={billFill}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name={"limite_mensual"}
                        rules={{ required: false }}
                        render={({ field: { value, onChange } }) => (
                            <InputCurrency
                                label="Límite mensual de gastos (opcional)"
                                placeholder="Escribe monto"
                                onChange={(value) => {
                                    onChange(value)
                                }}
                                value={value}
                                limit={9999999999}
                            />
                        )}
                    />
                    <div className="modal--confirm__divider"></div>
                    <Button className="gasto-add-modal-button" type={"submit"} text={"Crear Categoría"} />
                </form>
            </Modal>
        </>
    )
}
