import { useState } from "react"
import { useGetAlmacenesForDropQuery, useGetCategoriasRsQuery } from "src/gql/schema"
import { Controller, useForm } from "react-hook-form"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import { useNavigate } from "react-router-dom"
import { useProfile } from "src/shared/hooks/useProfile"
import Screen from "src/shared/components/layout/screen/Screen"
import Switch from "src/shared/components/forms/switch/Switch"
import InputText from "src/shared/components/forms/input-text/InputText"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { InputFoto } from "src/shared/components/forms/input-foto/InputFoto"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import { Button } from "src/shared/components/forms/button/Button"
import Icon from "src/shared/icons/Icon"
import { unitOptions } from "./Form.constants"
import { Section, ToggleSection } from "./sections/Section"
import { Tooltip } from "./sections/Tooltip"
import { InputCategory } from "./sections/Category"
import { InputNumber } from "./sections/InputNumber"
import { InputPrice } from "./sections/InputPrice"
import CloseModal from "./modals/close"
import { Percent } from "./sections/Percent"
import { FormProductoProps, FormValues } from "./Form.types"
import "./Form.css"

function FormProducto({ type = "add", onChange, defaultValues }: FormProductoProps): JSX.Element {
    const { hotel_id } = useProfile()
    const { data: fetchAlmacenes } = useGetAlmacenesForDropQuery({ variables: { hotel_id } })
    const { data: categorias_articulos } = useGetCategoriasRsQuery({ variables: { hotel_id } })

    const navigate = useNavigate()
    const { control, handleSubmit, setValue } = useForm<FormValues>({ defaultValues })
    const [visible, setVisible] = useState<boolean>(false)

    const onSubmit = (data: FormValues) => {
        const categoria = categorias_articulos?.categorias_articulos?.find(
            ({ categoria_id }) => categoria_id === data.categoria_id
        )
        onChange({ ...data, categoria: categoria?.nombre || "" })
    }

    useEscapeKey({
        onEscape: () => {
            navigate(-1)
        },
    })

    return (
        <Screen
            className="product-form__screen"
            title={`${type === "add" ? "Nuevo" : "Editar"} artículo`}
            contentClassName="product-form__content"
            close
            onClose={() => setVisible(true)}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="product-form__body">
                <div>
                    <Controller
                        name={"foto"}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <InputFoto
                                modalTitle="Foto del artículo"
                                modalSubtitle="Ajusta la imagen del artículo en el centro del círculo"
                                className="product-form__foto"
                                pictureSrc={typeof value === "string" ? value : ""}
                                onPictureChange={onChange}
                            />
                        )}
                    />
                </div>
                <div className="product-form__col-form">
                    <Section title="Información general" className="product-form__info">
                        <div className="product-form__info__grid">
                            <Controller
                                control={control}
                                name={"nombre"}
                                rules={{ required: true, maxLength: 60 }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputText
                                        icon={Icon}
                                        value={value}
                                        label={"Nombre del artículo"}
                                        placeholder={"Escribe un nombre"}
                                        type={"text"}
                                        onChange={(value) => onChange(value)}
                                        error={!!error}
                                        errorhinttext={
                                            error?.type === "maxLength"
                                                ? "Máximo de caracteres: 60"
                                                : "Escribe el nombre del artículo"
                                        }
                                        iconProps={{
                                            name: "clipboard",
                                            height: 16,
                                            width: 16,
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"marca"}
                                rules={{ required: false }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputText
                                        icon={Icon}
                                        value={value}
                                        label={"Marca"}
                                        placeholder={"Escribe la marca del artículo"}
                                        type={"text"}
                                        onChange={(value) => onChange(value)}
                                        error={!!error}
                                        errorhinttext={"Escribe la marca del artículo"}
                                        iconProps={{
                                            name: "priceTag",
                                            height: 16,
                                            width: 16,
                                            color: "var(--header)",
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"sku"}
                                rules={{ required: false }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputText
                                        inputWrapperClass="product-form__input-tooltip"
                                        icon={Icon}
                                        value={value}
                                        label={"SKU"}
                                        placeholder={"Escribe el SKU del artículo"}
                                        type={"text"}
                                        onChange={(value) => onChange(value)}
                                        error={!!error}
                                        errorhinttext={"Escribe el SKU del artículo"}
                                        iconProps={{
                                            name: "priceTagFilled",
                                            height: 16,
                                            width: 16,
                                            color: "var(--header)",
                                        }}
                                        toolTipInfo={true}
                                        tooltipLabel={{
                                            title: "SKU (Stock Keeping Unit)",
                                            description:
                                                "Es un código único utilizado para identificar y rastrear un artículo en el inventario de una empresa.",
                                            theme: "dark",
                                        }}
                                    />
                                )}
                            />
                            {type === "add" && (
                                <Controller
                                    control={control}
                                    name={"almacen_id"}
                                    rules={{ required: true }}
                                    render={({ field: { value }, fieldState: { error } }) => (
                                        <Dropdown
                                            className="product-form__select"
                                            value={value}
                                            label={"Almacén"}
                                            placeholder={"Selecciona un almacén"}
                                            options={
                                                fetchAlmacenes?.almacenes?.map(({ nombre = "", almacen_id = "" }) => {
                                                    return {
                                                        label: nombre,
                                                        value: almacen_id,
                                                    }
                                                }) || []
                                            }
                                            onClick={({ value }) => {
                                                setValue("almacen_id", value)
                                                setValue("categoria_id", "")
                                            }}
                                            errorHintText={error ? "Elige un almacén" : ""}
                                            icon="FolderOpenFilled"
                                            iconInOptions={false}
                                        />
                                    )}
                                />
                            )}
                            <Controller
                                control={control}
                                name={"unidad"}
                                rules={{ required: true }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Dropdown
                                        className="product-form__select"
                                        value={value}
                                        label={"Unidad de medida"}
                                        placeholder={"Selecciona una unidad de medida"}
                                        options={unitOptions}
                                        onClick={({ value }) => onChange(value)}
                                        errorHintText={error ? "Elige una unidad de medida" : ""}
                                        icon="rulerFilled"
                                        iconInOptions={false}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"contenido"}
                                rules={{ required: true }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputNumber
                                        value={value}
                                        label={"Contenido neto por unidad"}
                                        placeholder={"Escribe una cantidad"}
                                        type={"text"}
                                        onChange={onChange}
                                        error={!!error}
                                        errorhinttext={"Escribe el contenido neto del artículo"}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"costo"}
                                rules={{ required: true, validate: (value) => value > 0 }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputCurrency
                                        inputWrapperClass="product-form__input-tooltip"
                                        whiteSpace={true}
                                        value={value}
                                        error={!!error}
                                        onChange={onChange}
                                        label={"Costo por unidad de artículo"}
                                        placeholder={"Escribe una cantidad"}
                                        toolTipInfo={true}
                                        errorhinttext={"Escribe el costo por unidad del artículo"}
                                        tooltipLabel={{
                                            title: "Costo por unidad de artículo",
                                            description: "Valor de compra por unidad",
                                            theme: "dark",
                                        }}
                                        icon={"coinsFill"}
                                    />
                                )}
                            />
                        </div>
                    </Section>
                    <Section title="Inventario" contentClassName="product-form__inv">
                        {type === "add" && (
                            <Controller
                                control={control}
                                name={"cantidad_inventario"}
                                rules={{ required: true }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <InputNumber
                                        inputWrapperClass="product-form__input-tooltip"
                                        value={value}
                                        error={!!error}
                                        onChange={onChange}
                                        icon={Icon}
                                        label={"Cantidad de unidades en inventario"}
                                        placeholder={"Escribe la cantidad de artículo a registrar en el inventario"}
                                        toolTipInfo={true}
                                        type={"text"}
                                        errorhinttext={"Escribe la cantidad de artículo a inventario"}
                                        tooltipLabel={{
                                            title: "Cantidad de unidades en inventario",
                                            description:
                                                "Número de artículos que se registrará en el inventario. Podrás resurtir tu inventario posteriormente en otro módulo.",
                                            theme: "dark",
                                        }}
                                        iconProps={{
                                            name: "packageFill",
                                            height: 16,
                                            width: 16,
                                        }}
                                    />
                                )}
                            />
                        )}
                        <Controller
                            control={control}
                            name={"alerta_inventario"}
                            rules={{ required: false }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputNumber
                                    inputWrapperClass="product-form__input-tooltip"
                                    value={value}
                                    error={!!error}
                                    onChange={onChange}
                                    icon={Icon}
                                    label={"Alerta por inventario bajo"}
                                    placeholder={"Escribe una cantidad"}
                                    toolTipInfo={true}
                                    type={"text"}
                                    hinttext={"Opcional"}
                                    tooltipLabel={{
                                        title: "Alerta por inventario bajo",
                                        description:
                                            "Easyroom te alertará como “inventario bajo” cuando el artículo llegue a la cantidad registrada.",
                                        theme: "dark",
                                    }}
                                    iconProps={{
                                        name: "Inbox",
                                        height: 16,
                                        width: 16,
                                    }}
                                />
                            )}
                        />
                    </Section>
                    <ToggleSection control={control}>
                        <div className="product-form__costo">
                            <div className="product-form__costo-row">
                                <InputCategory
                                    control={control}
                                    list={fetchAlmacenes?.almacenes || []}
                                    categoryList={categorias_articulos?.categorias_articulos || []}
                                />
                                <InputPrice control={control} />
                                <Percent control={control} />
                            </div>
                            {type === "edit" && (
                                <p className="product-form__costo-alert">
                                    {
                                        "*Nota: Ten en cuenta que al editar estos valores, se actualizará el “Costo total de inventario” y “Valor comercial” de tu artículo e inventario."
                                    }
                                </p>
                            )}
                        </div>
                    </ToggleSection>
                    <div className="product-form__footer">
                        {type === "edit" && (
                            <div className="product-form__active">
                                <Controller
                                    control={control}
                                    name={"activo"}
                                    render={({ field: { value, onChange } }) => (
                                        <Switch
                                            className="product-form__active-switch"
                                            label={"Artículo activado"}
                                            value={value}
                                            onChange={(lvalue) => {
                                                onChange(lvalue)
                                            }}
                                        />
                                    )}
                                />
                                <Tooltip
                                    title={"Activación del artículo"}
                                    description={
                                        "La activación del artículo permitirá ser vendido y descontado del inventario ya sea por venta o por consumo de recetas o procesos."
                                    }
                                />
                            </div>
                        )}
                        <Button
                            className="product-form__button"
                            type={"submit"}
                            text={type === "add" ? "Registrar artículo" : "Guardar cambios"}
                        />
                    </div>
                </div>
            </form>
            <CloseModal
                title={`Abandonar ${type === "add" ? "el registro" : "la edición"}`}
                visible={visible}
                onClose={() => setVisible(false)}
            />
        </Screen>
    )
}

export default FormProducto
