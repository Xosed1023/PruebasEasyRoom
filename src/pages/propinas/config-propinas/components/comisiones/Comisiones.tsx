import "../../ConfigPropinas.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    useActualizarAportacionesPropinasPorCategoriaMutation,
    useActualizarConfiguracionPropinaMutation,
    useGetCategoriasArticulosPropinasQuery,
    useGetConfiguracionesPropinaQuery,
} from "src/gql/schema"
import Switch from "src/shared/components/forms/switch/Switch"
import InputPercent from "src/shared/components/forms/InputPercent/InputPercent"
import Percent from "src/shared/icons/Percent"
import { Button } from "src/shared/components/forms"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useProfile } from "src/shared/hooks/useProfile"

const Comisiones = () => {
    const { showSnackbar } = useSnackbar()
    const [switchEfectivo, setSwitchEfectivo] = useState<boolean>(false)
    const [switchTerminal, setSwitchTerminal] = useState<boolean>(false)
    const [switchUtilidad, setSwitchUtilidad] = useState<boolean>(false)
    const [switchRS, setSwitchRS] = useState<boolean>(false)
    const [efectivo, setEfectivo] = useState<string>("")
    const [terminal, setTerminal] = useState<string>("")
    const [cambio, setCambio] = useState<boolean>(false)
    const [valuesRS, setValuesRS] = useState<any>({})
    const [utilidad, setUtilidad] = useState<string>("")

    const { hotel_id, rolName } = useProfile()
    const isRecepcionista = rolName === "RECEPCIONISTA"

    const navigate = useNavigate()

    const [actualizarConfiguracionPropina] = useActualizarConfiguracionPropinaMutation()
    const [actualizarAportacionesPropinasPorCategoria] = useActualizarAportacionesPropinasPorCategoriaMutation()

    const { data: fetchConfig } = useGetConfiguracionesPropinaQuery({
        variables: { hotel_id },
        onCompleted(data) {
            const config = data?.configuraciones_propina?.[0]
            if (config) {
                const porcentaje_venta_efectivo = config?.porcentaje_venta_efectivo || 0
                const porcentaje_venta_tarjeta = config?.porcentaje_venta_tarjeta || 0
                const porcentaje_comision_por_puntos = config?.porcentaje_comision_por_puntos || 0

                if (porcentaje_venta_efectivo > 0) {
                    setEfectivo(`${porcentaje_venta_efectivo}`)
                    setSwitchEfectivo(true)
                }
                if (porcentaje_venta_tarjeta > 0) {
                    setTerminal(`${porcentaje_venta_tarjeta}`)
                    setSwitchTerminal(true)
                }
                if (porcentaje_comision_por_puntos > 0) {
                    setUtilidad(`${porcentaje_comision_por_puntos}`)
                    setSwitchUtilidad(true)
                }
            }
        },
    })

    const { data: fetchCategories } = useGetCategoriasArticulosPropinasQuery({
        variables: { hotel_id },
        onCompleted(data) {
            const categories = data?.categorias_articulos || []
            if (categories && categories?.length > 0) {
                let obj = {}
                categories.forEach((i) => {
                    const value = i?.porcentaje_aportacion_propinas || 0
                    if (value > 0) obj = { ...obj, [i?.categoria_id]: `${value}` }
                })

                setSwitchRS(Object.keys(obj).length > 0)
                setValuesRS(obj)
            }
        },
    })

    const disabledButton = () => {
        const categories: string[] = Object.values(valuesRS) || []

        if (terminal === "" || categories.includes("")) {
            return true
        } else if (
            parseFloat(efectivo) > 100 ||
            parseFloat(terminal) > 100 ||
            parseFloat(utilidad) > 100 ||
            categories.filter((i) => parseFloat(`${i}`) > 100).length > 0 ||
            categories.reduce((acum: any, value) => acum + parseFloat(`${value}`), 0) > 100
        ) {
            return true
        } else if (!cambio) {
            return true
        } else if (cambio) {
            if (
                (switchTerminal && terminal === "") ||
                (switchRS && categories.length === 0)
            ) {
                return true
            }
        } else {
            return false
        }
    }

    const updateConfig = async () => {
        const config = fetchConfig?.configuraciones_propina?.[0]
        const variables = {
            configuracion_propina_id: config?.configuracion_propina_id || "",
            fecha_registro: config?.fecha_registro || "",
            hotel_id,
            porcentaje_venta_efectivo: switchEfectivo ? parseFloat(efectivo) : 0,
            porcentaje_venta_tarjeta: switchTerminal ? parseFloat(terminal) : 0,
            porcentaje_comision_por_puntos: switchUtilidad ? parseFloat(utilidad) : 0,
        }

        const keys = fetchCategories?.categorias_articulos?.map((i) => i?.categoria_id) || []

        const aportaciones_propinas_by_categoria = keys?.map((key) => {
            return {
                categoria_id: key,
                porcentaje_aportacion_propinas: parseFloat(valuesRS?.[key]) || 0,
            }
        })

        try {
            const { data: resConfig } = await actualizarConfiguracionPropina({
                variables: {
                    UpdateConfiguracionPropinaInput: variables,
                },
            })
            const { data: resCategories } = await actualizarAportacionesPropinasPorCategoria({
                variables: {
                    aportaciones_roomservice: {
                        aportaciones_propinas_by_categoria,
                    },
                },
            })

            if (
                resConfig?.actualizar_configuracion_propina &&
                resCategories?.actualizar_aportaciones_propinas_por_categoria
            ) {
                navigate(-1)
                showSnackbar({
                    title: "Cambios guardados",
                    text: "Se han guardado los cambios exitosamente.",
                    status: "success",
                })
            } else {
                showSnackbar({
                    title: "Error al guardar cambios",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            }
        } catch (e) {
            showSnackbar({
                title: "Error al guardar cambios",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                status: "error",
            })
        }
    }

    return (
        <div className="config-propinas__content">
            <div className="config-propinas__row">
                <Switch
                    value={switchEfectivo}
                    onChange={(value) => {
                        setEfectivo("")
                        setSwitchEfectivo(value)
                        setCambio(true)
                    }}
                    disabled={isRecepcionista}
                />
                <div className="config-propinas__row_content">
                    <p className="config-propinas__row_title">
                        {"Porcentaje de aportación sobre la venta de estancia"}
                    </p>
                    <p className="config-propinas__row_subtitle">
                        {
                            "De la venta total de habitaciones, personas extra, horas extra y renovaciones por vendedor, se utilizará un porcentaje que se destinará a un fondo para pagar propinas a otros colaboradores."
                        }
                    </p>
                    <InputPercent
                        withSymbol={false}
                        value={efectivo}
                        onChange={(value) => {
                            setCambio(true)
                            setEfectivo(value.target.value)
                        }}
                        inputWrapperClass="config-propinas__input"
                        placeholder="Agrega un número"
                        label="Porcentaje de aportación"
                        icon={Percent}
                        disabled={!switchEfectivo || isRecepcionista}
                        error={parseFloat(efectivo) > 100 ? true : false}
                        errorhinttext="Ingresa un número menor a 100%"
                    />
                </div>
            </div>
            <div className="config-propinas__row">
                <Switch
                    value={switchRS}
                    onChange={(value) => {
                        setValuesRS({})
                        setSwitchRS(value)
                        setCambio(true)
                    }}
                    disabled={isRecepcionista}
                />
                <div className="config-propinas__row_content">
                    <p className="config-propinas__row_title">
                        {"Porcentaje de aportación sobre la venta de room service y restaurante "}
                    </p>
                    <p className="config-propinas__row_subtitle">
                        {
                            "Un porcentaje de las ventas por categoría de consumo se destinará al fondo para pagar propinas a otros colaboradores."
                        }
                    </p>
                    <div className="config-propinas__grid">
                        {fetchCategories?.categorias_articulos?.map((i, index) => (
                            <InputPercent
                                withSymbol={false}
                                key={index}
                                value={valuesRS?.[i?.categoria_id] || ""}
                                onChange={(value) => {
                                    setCambio(true)
                                    setValuesRS({ ...valuesRS, [i?.categoria_id]: value.target.value })
                                }}
                                placeholder="Agrega un número"
                                label={i?.nombre}
                                icon={Percent}
                                disabled={!switchRS || isRecepcionista}
                                error={parseFloat(valuesRS?.[i?.categoria_id]) > 100 ? true : false}
                                errorhinttext="Ingresa un número menor a 100%"
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="config-propinas__row">
                <Switch
                    value={switchTerminal}
                    onChange={(value) => {
                        setTerminal("")
                        setSwitchTerminal(value)
                        setCambio(true)
                    }}
                    disabled={isRecepcionista}
                />
                <div className="config-propinas__row_content">
                    <p className="config-propinas__row_title">
                        {"Aportación sobre propinas por uso de terminal bancaria"}
                    </p>
                    <p className="config-propinas__row_subtitle">
                        {
                            "Tarifa que los colaboradores deberán pagar para liquidar las comisiones generadas por el cobro de propinas a través de terminales bancarias."
                        }
                    </p>
                    <InputPercent
                        withSymbol={false}
                        value={terminal}
                        onChange={(value) => {
                            setCambio(true)
                            setTerminal(value.target.value)
                        }}
                        inputWrapperClass="config-propinas__input"
                        placeholder="Agrega un número"
                        label="Porcentaje de comisión"
                        icon={Percent}
                        disabled={!switchTerminal || isRecepcionista}
                        error={parseFloat(terminal) > 100 ? true : false}
                        errorhinttext="Ingresa un número menor a 100%"
                    />
                </div>
            </div>
            <div className="config-propinas__row">
                <Switch
                    value={switchUtilidad}
                    onChange={(value) => {
                        setUtilidad("")
                        setSwitchUtilidad(value)
                        setCambio(true)
                    }}
                    disabled={isRecepcionista}
                />
                <div className="config-propinas__row_content">
                    <p className="config-propinas__row_title">{"Utilidad sobre propinas"}</p>
                    <p className="config-propinas__row_subtitle">
                        {"Retención sobre aportaciones al fondo de propinas que realizan los colaboradores."}
                    </p>
                    <InputPercent
                        withSymbol={false}
                        value={utilidad}
                        onChange={(value) => {
                            setCambio(true)
                            setUtilidad(value.target.value)
                        }}
                        inputWrapperClass="config-propinas__input"
                        placeholder="Agrega un número"
                        label="Porcentaje de comisión"
                        icon={Percent}
                        disabled={!switchUtilidad || isRecepcionista}
                        error={parseFloat(utilidad) > 100 ? true : false}
                        errorhinttext="Ingresa un número menor a 100%"
                    />
                </div>
            </div>
            <Button
                disabled={disabledButton() || isRecepcionista}
                text={"Guardar cambios"}
                className="config-propinas__button"
                onClick={() => updateConfig()}
            />
        </div>
    )
}

export default Comisiones