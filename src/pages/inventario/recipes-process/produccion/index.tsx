import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Controller, FormProvider, useForm } from "react-hook-form"
import {
    useCrearProduccionProcesoMutation,
    useGetAlmacenesForDropQuery,
    useGetArticuloForProductionQuery,
    useGetRecetaForDetailQuery,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { useIngredientes } from "./hooks/useIngredientes"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import Screen from "src/shared/components/layout/screen/Screen"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import useSnackbar from "src/shared/hooks/useSnackbar"
import Tooltip from "src/shared/components/data-display/tooltip/Tooltip"
import { add, div } from "src/shared/helpers/calculator"
import Icon from "src/shared/icons"
import { InputNumber } from "./../../producto/form/sections/InputNumber"
import { getCurrencyFormat } from "src/utils/string"
import { useTable } from "./hooks/useTable"
import { CellName } from "./components/Cell"
import CostLabel from "./components/CostLabel"
import Section from "./components/Section"
import Resumen from "./components/Resumen"
import "./Produccion.css"

function Produccion(): JSX.Element {
    const [loader, setLoader] = useState<boolean>(true)
    const navigate = useNavigate()
    const params = useParams()

    const almacen_articulo_id = params?.almacen_articulo_id || ""
    const articulo_id = params?.articulo_id || ""

    const { hotel_id, usuario_id } = useProfile()
    const { data: fetchAlmacenes } = useGetAlmacenesForDropQuery({ variables: { hotel_id } })

    const { data: fetchArticulo } = useGetArticuloForProductionQuery({
        variables: { almacen_articulo_id },
        onCompleted: () => setLoader(false),
    })
    const { data: fetchReceta, loading: loadReceta } = useGetRecetaForDetailQuery({ variables: { articulo_id } })

    const articulo = fetchArticulo?.almacen_articulo
    const ingredientes = fetchReceta?.receta?.ingredientes_recetas || []

    const nombre = articulo?.articulo?.nombre || ""
    const unidad = articulo?.articulo?.unidad || ""
    const cantidad = articulo?.articulo?.contenido || 0
    const costo =
        fetchReceta?.receta?.ingredientes_recetas?.reduce(
            (acum, i) => add(acum, Number(i?.costo_por_cantidad_ingrediente || 0)),
            0
        ) || 0

    const methods = useForm({
        defaultValues: {
            almacen_destino_id: "",
            cantidad_produccion_final: "",
            costo_produccion: 0,
            costo_unitario: 0,
        },
    })

    const { control, clearErrors, getValues, setValue, trigger } = methods

    const { rows, headers } = useTable(ingredientes)
    const { alert: disabled } = useIngredientes(ingredientes)

    const { showSnackbar } = useSnackbar()

    const [crearProduccionProceso] = useCrearProduccionProcesoMutation()

    const onSubmit = async () => {
        const validation = await trigger()

        if (validation) {
            setLoader(true)
            const values = getValues()
            crearProduccionProceso({
                variables: {
                    createProductionProceso: {
                        articulo_id,
                        almacen_destino_id: values.almacen_destino_id,
                        cantidad_produccion_final: Number(values.cantidad_produccion_final || 0),
                        costo_produccion: values.costo_produccion,
                        usuario_autorizo_id: usuario_id,
                        hotel_id,
                    },
                },
            })
                .then(() => {
                    showSnackbar({
                        title: `Registro de producción de ${nombre}`,
                        text: `Se realizó el registro de producción **de ${
                            values.cantidad_produccion_final
                        } ${unidad}** de ${nombre} **modificando el costo de producción a ${getCurrencyFormat(
                            values.costo_produccion
                        )}.**`,
                        status: "success",
                    })
                })
                .catch(() => {
                    showSnackbar({
                        title: `Error al registrar producción de ${nombre}`,
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                })
                .finally(() => {
                    setLoader(false)
                    navigate(-1)
                })
        }
    }

    return (
        <Screen title="Producción" className="produccion__screen" contentClassName="produccion__content" back>
            <FormProvider {...methods}>
                <section className="produccion__form">
                    <Section
                        title={
                            <div className="produccion__section-row">
                                <p className="produccion__section-title" style={{ marginRight: 7 }}>
                                    {"Almacén destino de producción"}
                                </p>
                                <Tooltip
                                    placement={"bottom"}
                                    title={"Almacén destino de producción"}
                                    description={
                                        "Almacén donde se recibirán los productos finalizados tras el proceso de producción."
                                    }
                                    theme={"dark"}
                                >
                                    <Icon name={"infoToolTip"} />
                                </Tooltip>
                            </div>
                        }
                    >
                        <Controller
                            control={control}
                            name={"almacen_destino_id"}
                            rules={{ required: true }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <Dropdown
                                    className="produccion__select"
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
                                        onChange(value)
                                        if (error) clearErrors("almacen_destino_id")
                                    }}
                                    errorHintText={error ? "Elige un almacén" : ""}
                                    icon="FolderOpenFilled"
                                    iconInOptions={false}
                                />
                            )}
                        />
                    </Section>
                    <Section title={"Ingredientes"}>
                        <div className="produccion__table">
                            {!loadReceta ? (
                                <FlexibleTable
                                    tableItems={{
                                        ...{
                                            headers,
                                            rows: rows.map((row) => ({
                                                value: row.value.map(({ value }, index) => ({
                                                    value:
                                                        index === 1 ? (
                                                            <CellName label={value} alert={row?.alert} />
                                                        ) : index === 2 && typeof value === "number" && row?.alert ? (
                                                            <span className="produccion__cell-alert-label">
                                                                {value}
                                                            </span>
                                                        ) : (
                                                            value
                                                        ),
                                                })),
                                            })),
                                        },
                                    }}
                                    emptyState={{
                                        titile: "",
                                        subTitle: "No hay artículos",
                                        headerIcon: "surveyFill",
                                    }}
                                />
                            ) : (
                                <TableSkeleton headers={headers} />
                            )}
                        </div>
                        <div className="produccion__table-footer">
                            <p className="produccion__table-total produccion__table-total-mg">
                                {"Costo por producción"}
                            </p>
                            <p className="produccion__table-total">{getCurrencyFormat(Number(costo).toFixed(2))}</p>
                        </div>
                    </Section>
                    <Section title={"Cantidad de producción"}>
                        <p className="produccion__note">
                            {
                                "Ingresa la cantidad final obtenida para calcular el costo total de producción. Este se promediará con el costo de la cantidad disponible en tu inventario."
                            }
                        </p>
                        <Controller
                            control={control}
                            name={"cantidad_produccion_final"}
                            rules={{ required: true }}
                            render={({ field: { value }, fieldState: { error } }) => (
                                <div className="produccion__input">
                                    <InputNumber
                                        decimals={true}
                                        inputWrapperClass="produccion__input-wrap"
                                        icon={Icon}
                                        iconProps={{
                                            name: "documentBillFill",
                                            color: "var(--header)",
                                            height: 16,
                                            width: 16,
                                        }}
                                        value={value}
                                        label={"Producción final"}
                                        placeholder={"Escribe la cantidad de producción"}
                                        type={"text"}
                                        onChange={(value) => {
                                            if (error) clearErrors("cantidad_produccion_final")

                                            const costo_unitario = Number(div(costo, Number(value || 0)))

                                            setValue("cantidad_produccion_final", value)
                                            setValue("costo_unitario", costo_unitario)
                                            setValue("costo_produccion", Number(costo_unitario * cantidad))
                                        }}
                                        error={!!error}
                                        errorhinttext={"Escribe una cantidad de producción"}
                                    />
                                    <div className="produccion__input-type">{unidad}</div>
                                </div>
                            )}
                        />
                        <p className="produccion__price-label">
                            {"Costo por unidad mínima de producción: "}
                            <CostLabel unidad={unidad} />
                        </p>
                    </Section>
                </section>
                <Resumen
                    name={nombre}
                    unit={unidad}
                    quantity={cantidad}
                    cost={costo}
                    disabled={disabled || costo <= 0}
                    onSubmit={onSubmit}
                />
            </FormProvider>
            <LoaderComponent visible={loader} />
        </Screen>
    )
}

export default Produccion
