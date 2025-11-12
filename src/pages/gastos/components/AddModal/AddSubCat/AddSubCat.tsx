import React from "react"
import { Controller, useForm } from "react-hook-form"
import { CreateSubcategoriasGastosInput, useCreateSubCategoriMutation } from "src/gql/schema"
import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"
import { Button, InputText } from "src/shared/components/forms"
import { Modal } from "src/shared/components/layout/modal/Modal"
import DocFill from "src/shared/icons/DocFill"
import "./AddSubCat.css"
const defaultValues: CreateSubcategoriasGastosInput = {
    categoria_id: "",
    subcategoria: "",
}
interface AddSubCatProps {
    id: string
    onClose: () => void
    onSub: (value: { texto: string; success: boolean }) => void
}
const AddSubCat = ({ id, onClose, onSub }: AddSubCatProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues })
    const [createSubCategoriMutation] = useCreateSubCategoriMutation()
    const onSubmit = (data: CreateSubcategoriasGastosInput) => {
        data.categoria_id = id

        let sedText: {
            texto: string
            success: boolean
        } = {
            texto: "",
            success: false,
        }
        createSubCategoriMutation({
            variables: {
                subCat: {
                    categoria_id: id,
                    subcategoria: data.subcategoria,
                },
            },
        })
            .then(() => {
                sedText = {
                    texto: `La subcategoría ${data.subcategoria} ha sido creada exitosamente.`,
                    success: true,
                }
                onSub(sedText)
                onClose
            })
            .catch((err) => {
                sedText = {
                    texto: `Error al crear la subcategoría ${err} `,
                    success: false,
                }
                if (onSub) onSub(sedText)
                onClose
            })
        if (onClose) onClose()
    }
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            withCloseButton
            isCancelableOnClickOutside={true}
            width={717}
            className="add-sub-categoria-modal"
        >
            <HeaderIcon
                title="Nueva subcategoría de gastos"
                subTitle="Ingresa los datos que se piden a continuación"
                icon="docs"
            />
            <form className="add-sub-categoria-modal__form" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name={"subcategoria"}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                        <InputText
                            error={errors.subcategoria ? true : false}
                            style={{ width: "100%" }}
                            errorhinttext={errors.subcategoria ? "Escribe una subcategoría" : undefined}
                            className={"gasto-add-modal-form-input"}
                            label={"Nombre de la subcategoría"}
                            type={"text"}
                            placeholder={"Escribe nombre"}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            icon={DocFill}
                        />
                    )}
                />
                <Button className="add-sub-categoria-modal__button" type={"submit"} text={"Crear subcategoria"} />
            </form>
        </Modal>
    )
}

export default AddSubCat
