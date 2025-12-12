import { useMemo, useRef } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { TiposPagos } from "src/gql/schema"
import { InputCardNumber } from "src/shared/sections/payment/InputCardNumber"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { FormValues, MetodoProps } from "./Form.types"
import { InputCurrency } from "src/shared/sections/payment/InputCurrency"
import Icon from "src/shared/icons"
import Propina from "./Propina"
import { metodo_item, opciones_lista, opciones_base } from "./Form.constants"
import { getCurrencyFormat } from "src/utils/string"

const metodos_tarjeta = [TiposPagos.VisaOMastercard, TiposPagos.Amex]
const metodos_propina = [TiposPagos.Efectivo, ...metodos_tarjeta]
const metodos_referencia = [...metodos_tarjeta, TiposPagos.DepositoOTransferencia]

function Metodo(props: MetodoProps): JSX.Element {
    const { index, onRemove, metodo_origen } = props
    const total_general = props.subtotal
    const ref = useRef<any>(null)

    const {
        control,
        clearErrors,
        setError,
        formState: { errors },
        setValue,
    } = useFormContext<FormValues>()
    const metodos = useWatch({ control, name: "metodo_pago" })

    const { subtotal, tipo_pago, monto_propina, numero_referencia, metodo_id } = metodos?.[index] || metodo_item

    const mixto_mode = metodos.length >= 2
    const edicion_mode = metodos_propina.includes(tipo_pago as TiposPagos)
    const es_deposito = tipo_pago === TiposPagos.DepositoOTransferencia

    const propinas_mode = [...metodos_propina, TiposPagos.DepositoOTransferencia].includes(tipo_pago as TiposPagos)
    const difrencia_propina = monto_propina - metodo_origen.monto_propina
    const vista_propinas = subtotal && propinas_mode

    const opciones = useMemo(() => {
        const find = metodos.find((i) => i.tipo_pago === TiposPagos.Efectivo)
        return find ? opciones_base.filter((i) => i.value !== TiposPagos.Efectivo) : opciones_base
    }, [metodos])

    const getMetodos = (index: number) => metodos.filter((_, i) => i !== index)

    const onClearFields = (field: string) => {
        const errors_list = Array.isArray(errors?.metodo_pago) ? errors?.metodo_pago : []

        if (errors_list.length > 0) {
            errors_list.forEach((error, i) => {
                if (error?.[field]?.message) {
                    clearErrors(`metodo_pago.${i}.${field}` as any)
                }
            })
        }
    }

    return (
        <div className="cortes__edicion-pago__form-item">
            <p className="cortes__edicion-pago__form-title">{`Método de pago ${index + 1}`}</p>
            <div className="cortes__edicion-pago__form-inputs">
                <div className="cortes__edicion-pago__row-fields" style={{ marginBottom: edicion_mode ? 16 : 0 }}>
                    <Controller
                        control={control}
                        name={`metodo_pago.${index}.subtotal`}
                        rules={{ required: true }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <InputCurrency
                                whiteSpace={true}
                                limit={undefined}
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                errorhinttext={error ? error?.message : ""}
                                onChangeBlur={(number) => {
                                    let message = ""

                                    if (number < 1) {
                                        message = "Ingresa un monto"
                                    } else if (mixto_mode) {
                                        const subtotal_acumulado = getMetodos(index).reduce(
                                            (prev, current) => Number(prev + current.subtotal),
                                            0
                                        )
                                        const total_acumulado = subtotal_acumulado + number
                                        const restante = total_general - subtotal_acumulado
                                        if (total_acumulado > total_general || total_acumulado < total_general) {
                                            message =
                                                restante > 0
                                                    ? `Ingresa un monto igual a ${getCurrencyFormat(restante)}`
                                                    : "Edita un monto anterior, para agregar otra cantidad"
                                        }
                                    }

                                    if (message) {
                                        setError(`metodo_pago.${index}.subtotal`, {
                                            message,
                                            type: "validate",
                                        })
                                    }

                                    if (vista_propinas && metodo_origen.monto_propina > 0) {
                                        const options = [10, 15].map((option) => {
                                            return {
                                                label: `${option}%`,
                                                value: Number(((option / 100) * number).toFixed(2)),
                                            }
                                        })
                                        const find = options.find((i) => i?.value === monto_propina)

                                        const key = find ? find?.label : monto_propina > 0 ? "Otro" : ""

                                        ref.current?.handleKey(key)
                                    }
                                }}
                                onChangeFocus={() => onClearFields("subtotal")}
                                disabled={
                                    (!props.is_mixto ? metodos.length < 2 : false) ||
                                    (tipo_pago ? !edicion_mode : false)
                                }
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name={`metodo_pago.${index}.tipo_pago`}
                        rules={{ required: true }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => {
                            const enabled = !value || metodos_propina.includes(value as TiposPagos)
                            return (
                                <Dropdown
                                    options={
                                        enabled
                                            ? value === TiposPagos.Efectivo
                                                ? opciones_base
                                                : opciones
                                            : opciones_lista
                                    }
                                    value={value}
                                    placeholder={"Selecciona un método"}
                                    label={"Forma de pago"}
                                    icon={"creditCard"}
                                    errorHintText={error ? error?.message : ""}
                                    iconInOptions={false}
                                    onClick={({ value }) => {
                                        onChange(value)
                                        if (numero_referencia) {
                                            setValue(`metodo_pago.${index}.numero_referencia`, "")
                                            clearErrors(`metodo_pago.${index}.numero_referencia`)
                                        }
                                    }}
                                    disabled={!enabled}
                                />
                            )
                        }}
                    />
                    {subtotal && tipo_pago && metodos_referencia.includes(tipo_pago as TiposPagos) ? (
                        <Controller
                            control={control}
                            name={`metodo_pago.${index}.numero_referencia`}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputCardNumber
                                    disabled={es_deposito}
                                    label={"Número de tarjeta o referencia"}
                                    placeholder={"Máximo 10 dígitos"}
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    errorhinttext={error ? error?.message : ""}
                                    icon="iconHash"
                                    onFocus={() => onClearFields("numero_referencia")}
                                    onBlur={(e) => {
                                        const referencia = e.target.value
                                        let message = ""
                                        if (!referencia) {
                                            message = "Campo obligatorio"
                                        } else if (referencia.length < 4) {
                                            message = "Debe tener al menos 4 dígitos"
                                        } else if (mixto_mode) {
                                            const find = getMetodos(index).find(
                                                (i) => i.tipo_pago === tipo_pago && i.numero_referencia === referencia
                                            )
                                            if (find) message = "Método duplicado. Usa otro."
                                        }

                                        if (message) {
                                            setError(`metodo_pago.${index}.numero_referencia`, {
                                                message,
                                                type: "validate",
                                            })
                                        }
                                    }}
                                />
                            )}
                        />
                    ) : null}
                    {mixto_mode && edicion_mode ? (
                        <div
                            className="cortes__edicion-pago__remove"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    onRemove()
                                }
                            }}
                            onClick={onRemove}
                        >
                            <Icon height={24} width={24} name={"trashFilled"} color={"var(--purple-drawer-primario)"} />
                        </div>
                    ) : null}
                </div>
                {vista_propinas ? (
                    <div>
                        <p className="cortes__edicion-pago__propina-title">{"Incluir propina (opcional)"}</p>
                        <Controller
                            control={control}
                            name={`metodo_pago.${index}.monto_propina`}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <Propina
                                    ref={ref}
                                    disabled={es_deposito}
                                    amount={subtotal}
                                    currentValue={value}
                                    defaultValue={metodo_origen.monto_propina}
                                    options={[10, 15]}
                                    onChange={onChange}
                                />
                            )}
                        />
                        {metodo_origen.monto_propina !== monto_propina && !metodo_id.includes("nuevo_") ? (
                            <p className="cortes__edicion-pago__total">
                                {`Monto original ${getCurrencyFormat(subtotal + metodo_origen.monto_propina)} ${
                                    difrencia_propina > 0 ? "+ adicionales" : "- eliminados"
                                } ${getCurrencyFormat(Math.abs(difrencia_propina))} = Total actualizado`}{" "}
                                <span>{`${getCurrencyFormat(subtotal + monto_propina)}`}</span>
                            </p>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default Metodo
