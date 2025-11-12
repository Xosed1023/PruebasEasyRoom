import React, { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { CrearGastosMutationVariables, TiposPagos } from "src/gql/schema"
import HeaderIcon from "src/shared/components/data-display/header-icon/HeaderIcon"
import { Button, TextBox } from "src/shared/components/forms"
//import { DatePicker } from "src/shared/components/forms/datapicker/DatePicker"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import "./AddModalCrearGasto.css"
import { client } from "src/graphql"
import { CREAR_GASTO } from "../../Gastos-Graphql/mutations/crear-gasto"
import InputDate from "src/shared/components/forms/input-date/InputDate"
import { useCurrentRol } from "src/shared/widgets/hooks/general"
import { addDays } from "src/shared/helpers/addDays"
import { getDateString, getDateStringMDY, getNewDate } from "src/utils/date"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useProfile } from "src/shared/hooks/useProfile"
import { useCategoriaGastos } from "../../hooks/useCategoriaGastos"
import Switch from "src/shared/components/forms/switch/Switch"
import { usePrintTicket } from "src/shared/hooks/print"
import { useCurrentDate } from "src/shared/providers/CurrentdateProvider"

interface FormAddGasto {
    categoria_id: string
    comentarios?: string
    fecha_gasto: Date[]
    hotel_id: string
    metodo_pago: string
    monto: number
    usuario_id: string
    subcategoria_id?: any
    caja_chica: boolean
}

interface AddModalCrearGastoProps {
    closeModal: (value: boolean) => void
    folio: number
    onConfirm: () => void
}

const AddModalCrearGasto = ({ closeModal, folio, onConfirm }: AddModalCrearGastoProps) => {
    const [nameCategoria, setNameCategoria] = useState("")
    const [switchCaja, setSwitchCaja] = useState<boolean>(true)
    const rol = useCurrentRol()
    const { hotel_id, usuario_id } = useProfile()
    const { data } = useCategoriaGastos()
    const { handlePrint } = usePrintTicket()
    const [currentDate] = useCurrentDate()

    const categoriaGastos = useMemo(() => {
        const catGastos: { label: string; value: string }[] = []
        data?.categorias_gasto.map((gasto) => {
            catGastos.push({
                label: gasto.categoria,
                value: gasto.categoria_id,
            })
        })
        return catGastos.sort((a, b) => a.label.localeCompare(b.label))
    }, [data])

    const defaultValues: FormAddGasto = {
        categoria_id: "",
        comentarios: "",
        fecha_gasto: [currentDate],
        hotel_id: "",
        metodo_pago: "efectivo",
        monto: 0,
        usuario_id: "",
        subcategoria_id: "",
        caja_chica: true,
    }

    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<FormAddGasto>({
        defaultValues,
    })

    const { showSnackbar } = useSnackbar()
    const onSubmit = async (dataMutation: CrearGastosMutationVariables["datosGasto"]) => {
        const current = getDateString(dataMutation.fecha_gasto[0])

        dataMutation.hotel_id = hotel_id
        dataMutation.usuario_id = usuario_id
        if (dataMutation.caja_chica) {
            dataMutation.fecha_gasto = [currentDate]
        } else {
            dataMutation.fecha_gasto = getNewDate(current).toISOString()
        }

        try {
            const { data } = await client.mutate({
                mutation: CREAR_GASTO,
                variables: {
                    datosGasto: dataMutation,
                },
            })

            if (data?.crear_gasto?.gasto) {
                handlePrint(data?.crear_gasto?.ticket_id, "original")
                showSnackbar({
                    title: "Gasto registrado",
                    text: `Se registró el gasto de **${nameCategoria}** por **${formatCurrency(
                        dataMutation.monto
                    )}** el día **${getDateStringMDY(dataMutation.fecha_gasto)}** exitosamente.`,
                    status: "success",
                })
                onConfirm()
            } else {
                showSnackbar({
                    title: "Error al agregar gasto",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            }
        } catch (e) {
            showSnackbar({
                title: "Error al agregar gasto",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                status: "error",
            })
            console.log("error, ", e)
        }
        closeModal(false)
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

        arraySub.sort((a, b) => a.label.localeCompare(b.label))

        return arraySub
    }
    const subCategorias = subCategoria()

    return (
        <Modal
            className="addGastoModalContainer"
            isOpen={true}
            isCancelableOnClickOutside={false}
            withCloseButton={true}
            onClose={() => closeModal(false)}
        >
            <div className="addModalCrearGasto">
                <HeaderIcon icon="smallDollarSquare" title="Agregar gastos" />
                <form className="addModalCrearGasto__form" onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name={"caja_chica"}
                        rules={{ required: false }}
                        render={({ field: { value, onChange } }) => (
                            <Switch
                                disabled={rol === "RECEPCIONISTA" ? true : false}
                                className="guest-screen__switch"
                                label={"Gasto de caja chica"}
                                value={value}
                                onChange={(value) => {
                                    setSwitchCaja(value)
                                    value === true ? setValue("metodo_pago", "efectivo") : null
                                    value === true ? setValue("fecha_gasto", [currentDate]) : null
                                    onChange(value)
                                }}
                            />
                        )}
                    />
                    <p className="gasto-switch-text">Serán considerados para el cálculo del corte del día.</p>
                    <Controller
                        control={control}
                        name={"categoria_id"}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                            <Dropdown
                                style={{}}
                                errorHintText={errors.categoria_id ? "Selecciona una categoría" : undefined}
                                value={value}
                                label="Categoría del gasto"
                                placeholder="Selecciona una opción"
                                onClick={(value) => {
                                    setValue("subcategoria_id", null)
                                    subCategoria()
                                    onChange(value.value)
                                    setNameCategoria(value.label)
                                }}
                                icon="billFill"
                                options={categoriaGastos}
                                className={`${value ? "gastos-drop-no-border" : ""} `}
                            />
                        )}
                    />
                    <div
                        className={
                            rol === "RECEPCIONISTA"
                                ? "addModalCrearGasto__form__recepcion"
                                : "addModalCrearGasto__form__parallel-grid"
                        }
                    >
                        <Controller
                            control={control}
                            name={"subcategoria_id"}
                            rules={{ required: subCategorias?.length > 0 ? true : false }}
                            render={({ field: { onChange, value } }) => (
                                <Dropdown
                                    value={value || ""}
                                    label="Subcategoría"
                                    placeholder="Elige una opción"
                                    onClick={(value) => {
                                        if (value.value === "") onChange(null)
                                        else {
                                            onChange(value.value)
                                        }
                                    }}
                                    options={subCategorias}
                                    errorHintText={
                                        subCategorias?.length === 0
                                            ? undefined
                                            : errors.subcategoria_id
                                            ? "Selecciona una subcategoría"
                                            : undefined
                                    }
                                    disabled={subCategorias?.length > 0 ? false : true}
                                    icon="currencyFill"
                                    className={`${
                                        rol === "RECEPCIONISTA"
                                            ? "subcategoria-dropdown-recepcion"
                                            : "subcategoria-dropdown"
                                    } ${value ? "gastos-drop-no-border" : ""} `}
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
                                        disabledBeforeOrEqualDate={
                                            new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
                                        }
                                        disabledAfterOrEqualDate={addDays({ date: currentDate, days: 0 })}
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
                        <div className="monto-add-gasto">
                            <Controller
                                control={control}
                                name={"monto"}
                                rules={{ required: true, min: 1 }}
                                render={({ field: { onChange, value } }) => (
                                    <InputCurrency
                                        errorhinttext={errors.monto ? "Ingresa un monto" : undefined}
                                        error={errors.monto ? true : false}
                                        label="Monto"
                                        placeholder="Escribe un monto"
                                        onChange={(value) => onChange(value)}
                                        value={value}
                                        limit={9999999999}
                                        icon="dollarCircle"
                                    />
                                )}
                            />
                        </div>
                        <Controller
                            control={control}
                            name={"metodo_pago"}
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <Dropdown
                                    disabled={switchCaja}
                                    value={value}
                                    errorHintText={errors.metodo_pago ? "Selecciona un método de pago" : undefined}
                                    label="Método de pago"
                                    placeholder="Elige una opción"
                                    onClick={(value) => {
                                        onChange(value.value)
                                    }}
                                    options={[
                                        { label: "Efectivo", value: TiposPagos.Efectivo },
                                        { label: "Visa o Mastercard", value: TiposPagos.VisaOMastercard },
                                        { label: "Depósito/Transfer", value: TiposPagos.DepositoOTransferencia },
                                        { label: "AMEX", value: TiposPagos.Amex },
                                    ]}
                                    icon="creditCard"
                                    className={`dropdown-metodo-gastos ${value ? "gastos-drop-no-border" : ""} `}
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
                    <Button type={"submit"} text={"Agregar gasto"} style={{ width: "100%" }} />
                </form>
            </div>
        </Modal>
    )
}

export default AddModalCrearGasto
