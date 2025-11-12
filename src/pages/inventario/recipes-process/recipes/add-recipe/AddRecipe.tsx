import "./AddRecipe.css"
import FormSection from "../../../components/forms/form-section/FormSection"
import { Button, InputText } from "src/shared/components/forms"
import Screen from "src/shared/components/layout/screen/Screen"
import FormWrapper from "../../../components/forms/form-wrapper/FormWrapper"
import { InputFoto } from "src/shared/components/forms/input-foto/InputFoto"
import FormRow from "../../../components/forms/form-row/FormRow"
import Icon from "src/shared/icons"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import ValueDisplay from "../../../components/forms/value-display/ValueDisplay"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import Checkbox from "src/shared/components/forms/checkbox/Checkbox"
import InputMeasurement from "../../../components/forms/InputMeasurement/InputMeasurement"
import AddItem from "../../../components/forms/AddItem/AddItem"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import InputTextSuggestions, { InputTextSuggestion } from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import {
    AlmacenArticulo,
    UnidadConversionArticulo,
    UnidadMedidasArticulo,
    useActualizarRecetaProcesoMutation,
    useCategoriasArticulosNuevaRecetaProcesoQuery,
    useCrearRecetaProcesoMutation,
    useUnidadesConversionArticulosQuery,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { UNIDAD_MEDIDAS_DROPDOWN } from "src/constants/unidadMedidas"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { div, minus, sum, times } from "src/shared/helpers/calculator"
import { useNavigate, useParams } from "react-router-dom"
import { DefaultValues } from "./interfaces/defaultValues"
import createRecipe from "./helpers/createRecipe"
import { useEffect, useMemo, useRef, useState } from "react"
import useEditRecipe from "./hooks/useEditRecipe"
import useLoadingState from "src/shared/hooks/useLoadingState"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import updateRecipe from "./helpers/updateRecipe"
import useGetRecetaToEdit from "../../home/hooks/useGetRecetaToEdit"
import Switch from "src/shared/components/forms/switch/Switch"
import CloseModal from "src/pages/inventario/producto/form/modals/close"
import { v4 as uuid } from "uuid"
import updateIngredientsStatus from "./helpers/updateIngredientsStatus"
import useGetArticulosNuevoProceso from "../../process/add-process/hooks/useGetArticulosNuevoProceso"

const AddRecipe = () => {
    const { articulo_id } = useParams()
    const lastIngredientRef = useRef<HTMLDivElement | null>(null)
    const { usuario_id, hotel_id } = useProfile()

    const defaultValues: DefaultValues = useMemo(
        () => ({
            recipeName: "",
            measurement: "",
            photo: "",
            category: "",
            articles: articulo_id ? [] : [{ fieldId: uuid(), name: null, measurement: null, total: 0, articleFrom: null }],
            publicPrice: 0,
            isExtra: false,
        }),
        []
    )

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        trigger,
        formState: { dirtyFields, isDirty },
    } = useForm({ defaultValues })

    const { data: categoriasArticulos, loading: loadginRecetas } = useCategoriasArticulosNuevaRecetaProcesoQuery({
        variables: {
            hotel_id
        }
    })
    const {articulos, loadArticulos, loadArticulosPage} = useGetArticulosNuevoProceso()

    const { isLoading, isLoadingDelayed, toggleIsLoading } = useLoadingState()

    const { data: unidadesCoversion } = useUnidadesConversionArticulosQuery()

    const { receta } = useGetRecetaToEdit(articulo_id)

    useEditRecipe({
        articulo_id,
        setValue,
        receta,
        isDirty
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "articles",
        shouldUnregister: false,
    })
    const navigator = useNavigate()

    const ingredientes = watch("articles")
    const precioVenta = watch("publicPrice")

    const [isModalCloseOpen, setisModalCloseOpen] = useState(false)

    const suggestionsList = useMemo(() => {
        return articulos.filter(a => !ingredientes?.some(i => i?.name?.id === a?.almacen_articulo_id)).map((a) => ({
            id: a.almacen_articulo_id || "",
            title: a.articulo?.nombre || "",
            subtitle: a.almacen?.nombre || "",
            photoUrl:
                a.articulo?.foto || require("src/assets/webp/Producto.webp"),
        })) || []
    }, [articulos, ingredientes])

    useEffect(() => {
        updateIngredientsStatus({
            isDirty,
            setValue,
            ingredientes,
            unidadesConversionArticulo: unidadesCoversion?.unidades_conversion_articulos as UnidadConversionArticulo[],
        })
    }, [JSON.stringify(ingredientes)])

    const [crearReceta] = useCrearRecetaProcesoMutation()
    const { showSnackbar } = useSnackbar()
    const { showMiniSnackbar } = useMiniSnackbar()

    const [actualizarReceta] = useActualizarRecetaProcesoMutation()

    const onSubmit = async (data: DefaultValues) => {
        toggleIsLoading({ value: true })
        if (isLoading) {
            return
        }
        if (articulo_id) {
            updateRecipe({
                actualizarReceta,
                articulo_id,
                data,
                dirtyFields,
                navigate: navigator,
                showMiniSnackbar,
                receta,
            }).then(() => toggleIsLoading({ value: false }))
            return
        }
        createRecipe({
            categorias_articulos: categoriasArticulos,
            crearReceta,
            data,
            hotel_id,
            navigate: navigator,
            showSnackbar,
            usuario_id,
        }).then(() => toggleIsLoading({ value: false }))
    }

    const handleAddIngredient = () => {
        append({ fieldId: uuid(), name: null, measurement: null, total: 0, articleFrom: null })
        setTimeout(() => {
            lastIngredientRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 0)
    }

    return (
        <Screen
            title={articulo_id ? "Edición de receta" : "Nueva receta"}
            onClose={() => {
                if (isDirty) {
                    return setisModalCloseOpen(true)
                }
                navigator(-1)
            }}
            close
        >
            <FormWrapper
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                inputImage={
                    <Controller
                        control={control}
                        name="photo"
                        render={({ field: { onChange, value } }) => (
                            <InputFoto
                                modalSubtitle=""
                                modalTitle=""
                                onPictureChange={onChange}
                                pictureSrc={typeof value === "string" ? value : ""}
                            />
                        )}
                    />
                }
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormSection title="Información general">
                    <FormRow>
                        <Controller
                            control={control}
                            name="recipeName"
                            rules={{ required: true }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputText
                                    type="text"
                                    value={value}
                                    onChange={onChange}
                                    inputWrapperClass="add-recipe__input"
                                    label="Nombre de la receta"
                                    icon={Icon}
                                    iconProps={{ name: "surveyFill" }}
                                    placeholder="Escribe un nombre"
                                    error={!!error?.type}
                                    errorhinttext={error?.type === "required" ? "Escribe un nombre" : ""}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="measurement"
                            rules={{ required: true }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <Dropdown
                                    value={value}
                                    onClick={(v) => onChange(v.value)}
                                    icon="rulerFilled"
                                    containerClassName="add-recipe__input"
                                    options={UNIDAD_MEDIDAS_DROPDOWN}
                                    placeholder="Selecciona una opción"
                                    label="Unidad de medida"
                                    errorHintText={error?.type === "required" ? "Selecciona una opción" : ""}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="category"
                            rules={{ required: true }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <Dropdown
                                    value={value}
                                    onClick={(v) => onChange(v.value)}
                                    icon="FolderOpenFilled"
                                    tooltip={{
                                        title: "Categoría de receta",
                                        description:
                                            "Sección donde se registrará tu receta en el recetario y en Room service. También definirá el módulo de preparación donde se reflejará la receta.",
                                        placement: "bottom",
                                    }}
                                    containerClassName="add-recipe__input"
                                    options={
                                        categoriasArticulos?.categorias_articulos
                                            ?.filter((c) => c.nombre === "Alimentos" || c.nombre === "Bebidas")
                                            .reduce((acc, curr) => {
                                                if (!acc.some(item => item.label === curr.nombre)) {
                                                    acc.push({
                                                        label: curr.nombre,
                                                        value: curr.categoria_id,
                                                    });
                                                }
                                                return acc;
                                            }, [] as { label: string; value: string }[]) || []
                                    }
                                    placeholder="Selecciona una categoría"
                                    label="Categoría de receta"
                                    errorHintText={error?.type === "required" ? "Selecciona una opción" : ""}
                                />
                            )}
                        />
                    </FormRow>
                </FormSection>
                <FormSection
                    className="add-recipe__section__articles scrollbar__light-fat"
                    title="Artículos o ingredientes"
                    description="Para completar tu receta, agrega los artículos o ingredientes que ya registraste previamente en tu inventario."
                >
                    {fields.map((f, index) => (
                        <div
                            key={f.fieldId}
                            ref={index === fields.length - 1 ? lastIngredientRef : null}
                        >
                            <FormRow justifyContent="flex-start">
                                <Controller
                                    control={control}
                                    name={`articles.${index}.name`}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <InputTextSuggestions
                                            lazy
                                            onBottomReached={(v) => loadArticulosPage(v)}
                                            onTextChange={(v) => loadArticulos(v)}
                                            suggestionsListWidth="327px"
                                            className="add-recipe__input"
                                            inputTextConfig={{
                                                inputWrapperClass: "add-recipe__input",
                                                type: "text",
                                                label: "Ingrediente",
                                                placeholder: "Escribe un ingrediente de tu inventario",
                                                icon: Icon,
                                                iconProps: {
                                                    name: "LeafFill",
                                                },
                                                error: error?.type === "required",
                                                errorhinttext:
                                                    error?.type === "required" ? "Escribe un ingrediente" : "",
                                            }}
                                            suggestions={suggestionsList}
                                            value={value}
                                            onChange={(e) => {
                                                if (!e) {
                                                    setValue(`articles.${index}`, {
                                                        fieldId: uuid(),
                                                        name: null,
                                                        measurement: null,
                                                        total: 0,
                                                        articleFrom: null,
                                                    })
                                                    return
                                                }
                                                onChange(e)
                                                const ev = e as InputTextSuggestion
                                                const selectedArticulo = articulos.find(a => ev.id === a.almacen_articulo_id) as AlmacenArticulo
                                                setValue(`articles.${index}.articleFrom`, {
                                                    costo: selectedArticulo.articulo?.costo?.monto || 0,
                                                    id: selectedArticulo.almacen_articulo_id || "",
                                                    nombre: selectedArticulo.articulo?.nombre || "",
                                                    unidad: selectedArticulo.articulo?.unidad || UnidadMedidasArticulo.Pz,
                                                    contenido: selectedArticulo.articulo?.contenido || 0
                                                })
                                            }}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`articles.${index}.measurement`}
                                    rules={{
                                        required: true,
                                        min: 1,
                                        validate: (v) => {
                                            if (!v?.type) return "Selecciona una unidad de medida"
                                            if (!v?.value) return "Escribe una cantidad"
                                            return true
                                        },
                                    }}
                                    render={({ field: { value, onChange }, fieldState: { error, isDirty } }) => (
                                        <InputMeasurement
                                            placeholder="Ingresa una cantidad"
                                            options={articulos
                                                .find((a) => a.almacen_articulo_id === ingredientes[index].name?.id)
                                                ?.articulo?.unidades_disponibles?.map((u) => ({
                                                    value: u,
                                                }))}
                                            dropwownHeight="85px"
                                            label="Cantidad"
                                            limitLength={20}
                                            onChange={onChange}
                                            value={value}
                                            error={
                                                error?.type === "required" ||
                                                error?.type === "min" ||
                                                (isDirty && (!value?.type || !value?.value))
                                            }
                                            errorhinttext={
                                                error?.type === "required" ||
                                                error?.type === "min" ||
                                                (isDirty && (!value?.type || !value?.value))
                                                    ? "Escribe una cantidad"
                                                    : ""
                                            }
                                        />
                                    )}
                                />
                                {fields.length > 1 ? (
                                    <Icon
                                        name="trashFilled"
                                        style={{ marginTop: "30px" }}
                                        color="var(--primary)"
                                        onClick={() => (fields.length > 1 ? remove(index) : null)}
                                    />
                                ) : (
                                    <div style={{ width: 28, height: 28, marginTop: 30 }} />
                                )}
                                <ValueDisplay title="Costo por ingrediente" value={ingredientes[index].total} />
                            </FormRow>
                        </div>
                    ))}
                    <FormRow marginBottom={"30px"}>
                        <AddItem title="Agregar ingrediente" onClick={handleAddIngredient}/>
                        <ValueDisplay
                            title="Costo total de receta"
                            value={sum(ingredientes.map((i) => i.total))}
                            valueColor="var(--primary)"
                            style={{ marginRight: "148px" }}
                        />
                    </FormRow>
                </FormSection>
                <FormSection title="Venta al público">
                    <FormRow justifyContent="flex-start">
                        <Controller
                            control={control}
                            name="publicPrice"
                            rules={{ required: true, min: 1 }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputCurrency
                                    onChange={onChange}
                                    value={value}
                                    error={error?.type === "required" || error?.type === "min"}
                                    errorhinttext={
                                        error?.type === "required" || error?.type === "min" ? "Escribe un monto" : ""
                                    }
                                    placeholder="Escribe un monto"
                                    label="Precio de venta al público"
                                    inputWrapperClass="add-recipe__input__venta"
                                    icon="coinMoney"
                                    hinttext="Impuesto incluído 16%"
                                />
                            )}
                        />
                        <ValueDisplay
                            title="Porcentaje de ganancia por unidad"
                            value={
                                times(
                                    div(
                                        minus(precioVenta, sum(ingredientes.map((i) => i.total))),
                                        sum(ingredientes.map((i) => i.total)),
                                        0
                                    ),
                                    100
                                ) || 0
                            }
                            type="percent"
                        />
                    </FormRow>
                    <FormRow>
                        <Controller
                            control={control}
                            name="isExtra"
                            render={({ field: { value, onChange } }) => (
                                <Checkbox
                                    value={value}
                                    onChange={onChange}
                                    label='Vender producto como "extra"'
                                    className="add-recipe__input__checkbox"
                                    tooltip={{
                                        title: "Productos extra",
                                        description:
                                            "Al activar esta opción, el producto se visualizará para la venta en el apartado de “extras” e independientemente por categoría en Room service.",
                                    }}
                                />
                            )}
                        />
                    </FormRow>
                    <FormRow justifyContent="flex-end">
                        {receta?.articulo?.extra && (
                            <Controller
                                control={control}
                                name="isActive"
                                render={({ field: { value, onChange } }) => (
                                    <Switch
                                        label={value ? "Extra activado" : "Extra desactivado"}
                                        onChange={onChange}
                                        value={!!value}
                                        style={{ marginRight: "143px" }}
                                        tooltip={{
                                            title: "Activación del producto",
                                            description:
                                                "La activación del producto permitirá ser vendido y descontado del inventario ya sea por venta o por consumo de recetas o procesos.",
                                            theme: "dark",
                                        }}
                                    />
                                )}
                            />
                        )}
                        <Button
                            disabled={loadginRecetas || isLoadingDelayed || !isDirty}
                            theme="primary"
                            text={articulo_id ? "Guardar cambios" : "Registar receta"}
                            className="add-recipe__input"
                            onClick={() => trigger()}
                        />
                    </FormRow>
                </FormSection>
            </FormWrapper>
            <CloseModal
                title={`Abandonar ${articulo_id ? "la edición" : "el registro"}`}
                visible={isModalCloseOpen}
                onClose={() => setisModalCloseOpen(false)}
            />
            <LoaderComponent visible={isLoading} />
        </Screen>
    )
}

export default AddRecipe
