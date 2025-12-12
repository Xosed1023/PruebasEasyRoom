import React, { useEffect, useMemo, useRef, useState } from "react"

import "./AddProcess.css"
import FormSection from "../../../components/forms/form-section/FormSection"
import { Button, InputText } from "src/shared/components/forms"
import Screen from "src/shared/components/layout/screen/Screen"
import FormWrapper from "../../../components/forms/form-wrapper/FormWrapper"
import { InputFoto } from "src/shared/components/forms/input-foto/InputFoto"
import FormRow from "../../../components/forms/form-row/FormRow"
import Icon from "src/shared/icons"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import ValueDisplay from "../../../components/forms/value-display/ValueDisplay"
import InputMeasurement from "../../../components/forms/InputMeasurement/InputMeasurement"
import AddItem from "../../../components/forms/AddItem/AddItem"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import InputTextSuggestions, {
    InputTextSuggestion,
} from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import InputNumber from "src/shared/components/forms/InputNumber/InputNumber"
import { UNIDAD_MEDIDAS_DROPDOWN } from "src/constants/unidadMedidas"
import {
    AlmacenArticulo,
    UnidadConversionArticulo,
    UnidadMedidasArticulo,
    useActualizarRecetaProcesoMutation,
    useCrearRecetaProcesoMutation,
    useUnidadesConversionArticulosQuery,
} from "src/gql/schema"
import { DefaultValues } from "./interfaces/defaultValues"
import { useNavigate, useParams } from "react-router-dom"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useProfile } from "src/shared/hooks/useProfile"
import { sum } from "src/shared/helpers/calculator"
import createProcess from "./helpers/createProcess"
import useLoadingState from "src/shared/hooks/useLoadingState"
import updateProcess from "./helpers/updateProcess"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useEditProcess from "./hooks/useEditProcess"
import useGetRecetaToEdit from "../../home/hooks/useGetRecetaToEdit"
import CloseModal from "src/pages/inventario/producto/form/modals/close"
import { v4 as uuid } from "uuid"
import updateIngredientsStatus from "./helpers/updateIngredientsStatus"
import useGetArticulosNuevoProceso from "./hooks/useGetArticulosNuevoProceso"

const AddProcess = () => {
    const { articulo_id } = useParams()
    const lastIngredientRef = useRef<HTMLDivElement | null>(null)

    const defaultValues: DefaultValues = useMemo(
        () => ({
            processName: "",
            measurement: "",
            quantity: null,
            photo: null,
            articles: articulo_id ? [] : [{ fieldId: "", name: null, measurement: null, total: 0, articleFrom: null }],
        }),
        []
    )

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { dirtyFields, isDirty },
    } = useForm({ defaultValues })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "articles",
    })
    const navigate = useNavigate()

    const { receta } = useGetRecetaToEdit(articulo_id)
    const ingredientes = watch("articles")

    const { articulos, loadArticulos, loadArticulosPage } = useGetArticulosNuevoProceso()
    const { data: unidadesCoversion } = useUnidadesConversionArticulosQuery()

    const [isModalCloseOpen, setisModalCloseOpen] = useState(false)

    const [crearProceso] = useCrearRecetaProcesoMutation()
    const [actualizarProceso] = useActualizarRecetaProcesoMutation()
    const { usuario_id, hotel_id } = useProfile()
    const { showSnackbar } = useSnackbar()
    const { showMiniSnackbar } = useMiniSnackbar()
    useEditProcess({
        setValue,
        articulo_id,
        receta,
        isDirty,
    })

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

    const { isLoading, isLoadingDelayed, toggleIsLoading } = useLoadingState()

    const onSubmit = async (data: DefaultValues) => {
        if (isLoading) {
            return
        }
        toggleIsLoading({ value: true })
        if (articulo_id) {
            updateProcess({
                actualizarProceso,
                articulo_id,
                data,
                dirtyFields,
                navigate,
                showMiniSnackbar,
                receta,
            })
            return
        }
        createProcess({
            crearProceso,
            data,
            hotel_id,
            navigate,
            showSnackbar,
            usuario_id,
        })
    }

    const handleAddIngredient = () => {
        append({ fieldId: uuid(), name: null, measurement: null, total: 0, articleFrom: null })
        setTimeout(() => {
            lastIngredientRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 0)
    }

    return (
        <Screen
            title={articulo_id ? "Editar proceso" : "Nuevo proceso"}
            onClose={() => {
                if (isDirty) {
                    return setisModalCloseOpen(true)
                }
                navigate(-1)
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
                            name="processName"
                            rules={{ required: true }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputText
                                    type="text"
                                    value={value}
                                    onChange={onChange}
                                    inputWrapperClass="add-process__input"
                                    label="Nombre del proceso"
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
                            name="quantity"
                            rules={{ required: true, min: 1 }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputNumber
                                    value={value || undefined}
                                    allow0={false}
                                    onChange={onChange}
                                    tooltipLabel={{
                                        description:
                                            "Indica el número total de unidades que deseas obtener al finalizar el proceso",
                                        title: "Cantidad a producir",
                                        placement: "bottom",
                                    }}
                                    inputWrapperClass="add-process__input"
                                    icon={Icon}
                                    iconProps={{
                                        name: "packageFill",
                                    }}
                                    placeholder="Selecciona una opción"
                                    label="Cantidad a producir"
                                    error={error?.type === "required" || error?.type === "min"}
                                    errorhinttext={
                                        error?.type === "required" || error?.type === "min"
                                            ? "Escribe una cantidad mayor o igual a 1"
                                            : ""
                                    }
                                />
                            )}
                        />
                    </FormRow>
                </FormSection>
                <FormSection
                    className="add-process__section__articles scrollbar__light-fat"
                    title="Artículos o ingredientes"
                    description="Para completar tu proceso, agrega los artículos o ingredientes que ya registraste previamente en tu inventario."
                >
                    {fields.map((f, index) => (
                        <div key={f.fieldId} ref={index === fields.length - 1 ? lastIngredientRef : null}>
                            <FormRow justifyContent="flex-start" key={f.fieldId}>
                                <Controller
                                    control={control}
                                    name={`articles.${index}.name`}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <InputTextSuggestions
                                            lazy
                                            onBottomReached={(v) => loadArticulosPage(v)}
                                            onTextChange={(v) => loadArticulos(v)}
                                            className="add-process__input"
                                            inputTextConfig={{
                                                inputWrapperClass: "add-process__input",
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
                                            suggestionsListWidth="327px"
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
                                                const selectedArticulo = articulos.find(
                                                    (a) => ev.id === a.almacen_articulo_id
                                                ) as AlmacenArticulo
                                                setValue(`articles.${index}.articleFrom`, {
                                                    costo: selectedArticulo.articulo?.costo?.monto || 0,
                                                    id: selectedArticulo.almacen_articulo_id || "",
                                                    nombre: selectedArticulo.articulo?.nombre || "",
                                                    unidad:
                                                        selectedArticulo.articulo?.unidad || UnidadMedidasArticulo.Pz,
                                                    contenido: selectedArticulo.articulo?.contenido || 0,
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
                                            dropwownHeight="85px"
                                            label="Cantidad"
                                            limitLength={20}
                                            options={articulos
                                                .find((a) => a.almacen_articulo_id === ingredientes[index].name?.id)
                                                ?.articulo?.unidades_disponibles?.map((u) => ({
                                                    value: u,
                                                }))}
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
                        <AddItem title="Agregar ingrediente" onClick={handleAddIngredient} />
                        <ValueDisplay
                            title="Costo total de receta"
                            value={sum(ingredientes.map((i) => i.total))}
                            valueColor="var(--primary)"
                            style={{ marginRight: "148px" }}
                        />
                    </FormRow>
                </FormSection>
                <FormRow justifyContent="flex-end">
                    <Button
                        theme="primary"
                        text={articulo_id ? "Guardar cambios" : "Registar proceso"}
                        className="add-process__input"
                        disabled={isLoadingDelayed || !isDirty}
                    />
                </FormRow>
            </FormWrapper>
            <LoaderComponent visible={isLoading} />
            <CloseModal
                title={`Abandonar ${articulo_id ? "la edición" : "el registro"}`}
                visible={isModalCloseOpen}
                onClose={() => setisModalCloseOpen(false)}
            />
        </Screen>
    )
}

export default AddProcess
