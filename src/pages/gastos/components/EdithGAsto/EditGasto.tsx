import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { GetGastosQuery, TiposPagos, useActualizasGastoMutation } from "src/gql/schema"
import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"
import { Button, TextBox } from "src/shared/components/forms"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { useGastosList } from "../gastos-list/GastosList.hooks"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import useSnackbar from "src/shared/hooks/useSnackbar"
import "./../AddModalCrearGasto/AddModalCrearGasto.css"
import Switch from "src/shared/components/forms/switch/Switch"
import { useCurrentRol } from "src/shared/widgets/hooks/general"
import InputDate from "src/shared/components/forms/input-date/InputDate"
import { addDays } from "src/shared/helpers/addDays"
import { substractDays } from "src/shared/helpers/substractDays"
import { getDaysByMonth } from "src/shared/components/forms/input-date/components/MonthDays/helpers"
import { useCategoriaGastos } from "../../hooks/useCategoriaGastos"
import { useCurrentDate } from "src/shared/providers/CurrentdateProvider"

const formatTipoDePago = () => {
    const tiposPagosMapping: { [key: string]: { label: string; value: string } } = {
        [TiposPagos.Efectivo]: { label: "Efectivo", value: TiposPagos.Efectivo },
        [TiposPagos.VisaOMastercard]: { label: "Visa o Mastercard", value: TiposPagos.VisaOMastercard },
        [TiposPagos.DepositoOTransferencia]: { label: "Depósito/Transfer", value: TiposPagos.DepositoOTransferencia },
        [TiposPagos.Amex]: { label: "Amex", value: TiposPagos.Amex },
    }

    return Object.values(tiposPagosMapping)
}
interface subType {
    label: any
    value: any
}

interface FormAddGasto {
    categoria_id: string
    comentarios?: string
    fecha_gasto: Date[]
    metodo_pago: string
    monto: number
    usuario_id: string
    subcategoria_id?: any
    caja_chica: boolean
    gasto_id: string
}

const AddModalEdithGasto = ({
    closeModal,
    gasto,
    onConfirm,
}: {
    onConfirm: () => void
    closeModal: (value: boolean) => void
    gasto: GetGastosQuery["gastos"][0]
}) => {
    const gastosEdit = gasto
    const [currentDate] = useCurrentDate()
    const [switchCaja] = useState<boolean>((gasto as any)?.caja_chica)
    const [dayGasto] = useState(new Date(gasto?.fecha_gasto || currentDate))
    const rol = useCurrentRol()
    const month = dayGasto.getMonth()
    const year = dayGasto.getFullYear()
    const { data } = useCategoriaGastos()

    const defaultValues: FormAddGasto = {
        categoria_id: gasto?.categoria_id || "",
        gasto_id: gasto?.gasto_id || "",
        comentarios: gasto.comentarios || "",
        fecha_gasto: [new Date(gasto?.fecha_gasto)],
        metodo_pago: gasto?.metodo_pago || "",
        monto: gasto?.monto || 0,
        usuario_id: gasto.usuario_id || "",
        subcategoria_id: gasto?.subcategoria_id || "",
        caja_chica: (gasto as any)?.caja_chica || false,
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm<FormAddGasto>({
        defaultValues,
    })
    const enumTiposPago = formatTipoDePago()
    const [actualizasGastoMutation] = useActualizasGastoMutation()
    const [subcategorias, setSubcategorias] = useState<subType[]>([])

    const { showSnackbar } = useSnackbar()

    const { selectedCategorias, selectedSubCategorias, handleSelectCategory, categorias } = useGastosList()

    useEffect(() => {
        if (categorias && gasto?.categoria_id) {
            handleSelectCategory(gasto?.categoria_id)
        }
    }, [categorias, gasto.categoria_id])

    useEffect(() => {
        if (subcategorias?.length === 0) {
            if (selectedSubCategorias) {
                setSubcategorias(
                    selectedSubCategorias.map(({ subcategoria, subcategoria_gasto_id }) => {
                        return {
                            label: subcategoria,
                            value: subcategoria_gasto_id,
                        }
                    })
                )
            }
        }
    }, [subcategorias, selectedSubCategorias])

    const onSubmit = (variables: any): void => {
        const fecha_gasto = variables.caja_chica ? null : variables.fecha_gasto
        const category = selectedCategorias.find(
            ({ categoria_id }) => categoria_id === variables?.categoria_id
        )?.categoria

        actualizasGastoMutation({
            variables: {
                ActualizarGasto: { ...variables, subcategoria_id: variables?.subcategoria_id || null, fecha_gasto },
            },
        })
            .then(({ data }) => {
                if (data?.actualizar_gasto) {
                    showSnackbar({
                        title: "Gasto actualizado",
                        text: `Se actualizó el gasto${category ? ` de **“${category}”**` : ""} exitosamente.`,
                        status: "success",
                    })
                    closeModal(false)
                    onConfirm()
                } else {
                    showSnackbar({
                        title: "Error al actualizar el gasto",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                    closeModal(false)
                }
            })
            .catch((e) => {
                showSnackbar({
                    title: "Error al actualizar el gasto",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
                closeModal(false)
                console.log(e)
            })
    }

    const subCategoria = () => {
        let arraySub = [{ label: "", value: "", eliminado: false }]

        if (data) {
            const subCateghoriaFilter = data.categorias_gasto.filter(
                (data) => data.categoria_id === getValues("categoria_id")
            )
            if (subCateghoriaFilter.length > 0) {
                arraySub = subCateghoriaFilter[0].subcategorias_de_categoria.map((subcat) => ({
                    label: subcat.subcategoria,
                    value: subcat.subcategoria_gasto_id,
                    eliminado: subcat.eliminado,
                }))
                arraySub = arraySub.filter((data) => data.eliminado === false)
            } else {
                arraySub = []
            }
        } else {
            arraySub = []
        }

        return arraySub
    }
    const NewSubCategorias = subCategoria()

    return (
        <Modal
            className="addGastoModalContainer"
            isOpen={true}
            isCancelableOnClickOutside={false}
            withCloseButton={true}
            onClose={() => closeModal(false)}
        >
            <div className="addModalCrearGasto">
                <HeaderIcon
                    icon="smallDollarSquare"
                    title="Editar gastos"
                    subTitle={`${
                        rol === "RECEPCIONISTA"
                            ? "Gasto caja chica Folio R-"
                            : (gasto as any)?.caja_chica === true
                            ? "Gasto caja chica Folio A-"
                            : "Folio A-"
                    }${gastosEdit?.folio}`}
                />
                <form className="addModalCrearGasto__form" onSubmit={handleSubmit(onSubmit)}>
                    {rol === "ADMINISTRADOR" && (gasto as any)?.caja_chica === false && (
                        <Controller
                            control={control}
                            name={"caja_chica"}
                            rules={{ required: false }}
                            render={({ field: { value, onChange } }) => (
                                <Switch
                                    className="guest-screen__switch"
                                    label={"Gasto de caja chica"}
                                    value={value}
                                    onChange={(value) => {
                                        console.log("value, ", value)
                                    }}
                                    style={{ marginBottom: 15 }}
                                />
                            )}
                        />
                    )}
                    <Controller
                        name={"categoria_id"}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <Dropdown
                                icon="billFill"
                                errorHintText={errors.categoria_id ? "Selecciona una categoría" : undefined}
                                value={value}
                                label="Categoría del gasto"
                                placeholder={"Selecciona una opción"}
                                options={selectedCategorias.map(({ categoria, categoria_id }) => {
                                    return {
                                        label: categoria,
                                        value: categoria_id,
                                    }
                                })}
                                iconInOptions={false}
                                onClick={({ value }) => {
                                    setValue("subcategoria_id", "")
                                    subCategoria()
                                    onChange(value)
                                    handleSelectCategory(value)
                                }}
                            />
                        )}
                    />
                    <div className="addModalCrearGasto__form__parallel-grid">
                        <Controller
                            name={"subcategoria_id"}
                            control={control}
                            rules={{ required: NewSubCategorias?.length > 0 ? true : false }}
                            render={({ field: { onChange, value } }) => (
                                <Dropdown
                                    errorHintText={errors.subcategoria_id ? "Selecciona una categoría" : undefined}
                                    value={value}
                                    label="Subcategoría"
                                    placeholder={"Selecciona una opción"}
                                    icon="currencyFill"
                                    options={value ? subcategorias : NewSubCategorias}
                                    disabled={NewSubCategorias?.length > 0 ? false : true}
                                    iconInOptions={false}
                                    onClick={({ value }) => {
                                        if (value === "") onChange("")
                                        else {
                                            onChange(value)
                                        }
                                    }}
                                />
                            )}
                        />
                        {rol === "ADMINISTRADOR" && (
                            <Controller
                                control={control}
                                name={"fecha_gasto"}
                                rules={{ required: getValues("caja_chica") === true ? false : true }}
                                // onChange del Controller le da el nuevo valor al input dentro del estado del formulario y le establece también el valor a este DatePicker
                                render={({
                                    field: { onChange: onFieldChange, value: fieldValue },
                                    formState: { errors },
                                }) => (
                                    <InputDate
                                        disabled={switchCaja}
                                        placeholder="Selecciona una fecha"
                                        label="Fecha de gasto"
                                        inputClassName="add-gasto-input-fecha"
                                        modalClassName="add-gasto-modal-fecha"
                                        height="600px"
                                        width="400px"
                                        onReset={() => {
                                            onFieldChange([])
                                        }}
                                        disabledAfterOrEqualDate={addDays({
                                            date: dayGasto,
                                            days: getDaysByMonth({ month, year }) - dayGasto.getDate(),
                                        })}
                                        disabledBeforeOrEqualDate={substractDays({
                                            date: dayGasto,
                                            days: dayGasto.getDate(),
                                        })}
                                        onChange={(date) => {
                                            onFieldChange([date])
                                        }}
                                        value={fieldValue}
                                        errorHintText={errors.fecha_gasto ? "Selecciona un rango de fechas" : ""}
                                    />
                                )}
                            />
                        )}
                    </div>
                    <div className="addModalCrearGasto__form__parallel">
                        <Controller
                            control={control}
                            name={"monto"}
                            rules={{ required: true, min: 1 }}
                            render={({ field: { onChange, value } }) => (
                                <InputCurrency
                                    disabled={rol === "RECEPCIONISTA" ? true : false}
                                    errorhinttext={errors.monto ? "Ingresa un monto" : undefined}
                                    error={errors.monto ? true : false}
                                    label="Monto"
                                    icon="dollarCircle"
                                    placeholder="Agrega un monto"
                                    onChange={(value) => onChange(value)}
                                    value={value || 0}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name={"metodo_pago"}
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <Dropdown
                                    disabled={switchCaja}
                                    value={value || ""}
                                    errorHintText={errors.metodo_pago ? "Selecciona un método de pago" : undefined}
                                    label="Método de pago"
                                    icon="creditCard"
                                    placeholder="Elige una opción"
                                    onClick={(value) => {
                                        onChange(value.value)
                                    }}
                                    options={enumTiposPago}
                                    iconInOptions={false}
                                />
                            )}
                        />
                    </div>
                    <Controller
                        control={control}
                        name={"comentarios"}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <TextBox
                                className="addModalCrearGasto__form__parallel__text-box"
                                description="Descripción del gasto"
                                placeholder="Escribe un comentario..."
                                onChange={(value) => {
                                    if (value.target.value.length > 0) onChange(value.target.value)
                                    else onChange(undefined)
                                }}
                                errorHintText={errors.comentarios ? "Ingresa un comentario" : undefined}
                                error={errors.comentarios ? true : false}
                                value={value || ""}
                            />
                        )}
                    />
                    <Button type={"submit"} text={"Editar gasto"} style={{ width: "100%" }} />
                </form>
            </div>
        </Modal>
    )
}

export default AddModalEdithGasto
