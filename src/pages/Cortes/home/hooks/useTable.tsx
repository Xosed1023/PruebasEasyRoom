import { useEffect, useMemo, useState } from "react"
import { NOT_NUMER_METHODS, PAYMENT_METHODS } from "src/constants/payments"
import useSortTable from "src/shared/hooks/useSortTable"
import { getDateStringMDYH } from "src/utils/date"
import { getCurrencyFormat } from "src/utils/string"
import { formatConcepto } from "../helpers/formatConcepto"
import { Movimiento } from "../interfaces/MovimientosCorte"
import { Concepto } from "../interfaces/concepto"
import { splitBySlash } from "src/shared/helpers/splitBySlash"
//import { useDate } from "src/shared/hooks/useDate"

const ITEM_ALL = { value: "todos", valueToDisplay: "Todos" }

const PAYMENT_TYPES = {
    amex: PAYMENT_METHODS.amex,
    consumo_interno: PAYMENT_METHODS.consumoInterno,
    cortesia: PAYMENT_METHODS.cortesia,
    deposito_o_transferencia: PAYMENT_METHODS.depositoOTransferencia,
    efectivo: PAYMENT_METHODS.efectivo,
    visa_o_mastercard: PAYMENT_METHODS.visaOMasterCard,
    love_points: PAYMENT_METHODS.lovePoints,
    mixto: { value: "mixto", label: "Mixto" },
}

type Keys = keyof typeof PAYMENT_TYPES

export function useHeader(data: any[], categoriasSeleccionadas?: string[]) {
    const getFilterOptions = (key: string) => {
        const options: any[] = []

        data?.forEach((item) => {
            let value = item?.[key]
            if (key === "concepto") {
                if (
                    categoriasSeleccionadas &&
                    categoriasSeleccionadas.length > 0 &&
                    !categoriasSeleccionadas.includes(item.categoria)
                )
                    return
                if (value?.includes("/")) {
                    value = value.split("/")[0].trim()
                }

                if (value === "reserva") value = "Propina reserva"
                if (value === "renta") value = "Propina renta"
            }

            if (value) {
                const find = options.find((item) => item?.value === value)
                if (!find) options.push({ value, valueToDisplay: value })
            }
        })

        return options.length > 0 ? [ITEM_ALL, ...options] : []
    }

    const getPaymentItems = (keys: Keys[]) => {
        return keys.map((key) => {
            const item = PAYMENT_TYPES[key]
            return { value: item?.value, valueToDisplay: item?.label }
        })
    }

    const headers = useMemo(() => {
        const base = [
            { value: "#" },
            {
                value: "Categoría",
                filterMenu: getFilterOptions("categoria"),
            },
            {
                value: "Concepto",
                filterMenu: getFilterOptions("concepto"),
            },
            {
                value: "Monto",
                sort: true,
            },
            {
                value: "Método de pago",
                filterMenu: [
                    ITEM_ALL,
                    ...getPaymentItems([
                        "visa_o_mastercard",
                        "amex",
                        "efectivo",
                        "cortesia",
                        "deposito_o_transferencia",
                        "consumo_interno",
                        "mixto",
                    ]),
                ],
            },
            {
                value: "Fecha",
                sort: true,
            },
            {
                value: "Responsable",
                filterMenu: getFilterOptions("responsable"),
            },
            { value: "Acciones" },
        ]

        return base
    }, [data, categoriasSeleccionadas])

    return headers
}

export function useRows(data: Movimiento[]) {
    //const { UTCStringToLocalDate } = useDate()
    const [rows, setRows] = useState<any[]>([])

    const getPaymentKey = (key: string) => {
        if (key) {
            const items = key.split(", ")
            const clear = [...new Set([...items])]
            if (clear.length > 1) {
                return "mixto"
            } else {
                return clear[0] || ""
            }
        } else {
            return ""
        }
    }

    const isValidEdicion = (tipo_pago: string) => {
        const valid_keys = ["efectivo", "visa_o_mastercard", "amex"]
        const items = tipo_pago?.split(", ") || []
        const clear = [...new Set([...items])]
        const filter = clear.filter((item) => {
            const keys = item.split(" / ")
            const pago = keys?.[0] || ""
            return valid_keys.includes(pago)
        })

        return filter.length > 0
    }

    const getRowFormat = (list: Movimiento[]) => {
        const orderList =
            list.sort((a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime()) || []

        return orderList.map(
            ({
                folio = 0,
                categoria = "",
                concepto = "",
                total = 0,
                tipo_pago = "",
                fecha_registro = "",
                responsable = "",
                ticket_id = "",
            }) => {
                const payments = splitBySlash(tipo_pago)

                const list = categoria?.split(" / ")
                const base = [
                    { value: folio },
                    { value: categoria },
                    {
                        value: formatConcepto(
                            concepto === "reserva"
                                ? "Propina reserva"
                                : concepto === "renta"
                                ? "Propina renta"
                                : (concepto as Concepto)
                        ),
                    },
                    { value: getCurrencyFormat(total), fromHeaderSort: "Monto", sortValue: Number(total) },
                    {
                        value: (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>
                                    {payments.length > 1
                                        ? "Mixto"
                                        : PAYMENT_TYPES?.[getPaymentKey(payments?.[0]?.[0])]?.label || "N/A"}
                                </span>
                                {(payments.length > 1 || !NOT_NUMER_METHODS.includes(payments?.[0]?.[0])) && (
                                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                                        {payments.map((p, index) => (
                                            <span key={index} style={{ color: "var(--placeholder)" }}>
                                                {NOT_NUMER_METHODS.includes(p[0])
                                                    ? PAYMENT_TYPES?.[getPaymentKey(p[0])]?.label
                                                    : p[1]}
                                                {index < payments.length - 1 ? ",\u00A0" : ""}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ),
                    },
                    {
                        value: fecha_registro ? getDateStringMDYH(new Date(fecha_registro)) : "N/A",
                        fromHeaderSort: "Fecha",
                        sortValue: fecha_registro,
                    },
                    { value: `${responsable}` },
                    {
                        value: {
                            ticket_id,
                            tipo_pago: getPaymentKey(tipo_pago),
                            cancelacion: categoria?.includes("Cancelación"),
                            editar: isValidEdicion(tipo_pago || "") && !categoria?.includes("Propina"),
                            cancelar:
                                isValidEdicion(tipo_pago || "") &&
                                ["Estancia", "Horas extra", "Personas extra", "Hospedaje extra"].includes(
                                    `${categoria || ""}`
                                ),
                            total: Number(total || 0),
                            tipo: categoria || "",
                            folio,
                        },
                    },
                ]
                return {
                    goTo: categoria?.includes("Cancelación") ? ticket_id + "/" + list?.[1] : "",
                    value: base,
                }
            }
        )
    }

    useEffect(() => {
        if (data?.length > 0) {
            setRows(getRowFormat([...data]))
        } else {
            setRows([])
        }
    }, [])

    const handleSort = (params) => {
        const sortData = useSortTable({ sortState: params?.sort || null, sortedData: rows, i: params?.idx || 0 })
        setRows(sortData)
    }

    const handleFilter = (params: any[]) => {
        const getKeys = (id) => clearParams.filter(({ idx }) => idx === id).map(({ filter }) => filter)
        const findValue = (keys: string[], value: string) => (keys.length > 0 ? keys.includes(value) : true)

        const keyAll = params.filter(({ filter }) => filter === "todos")
        const clearParams =
            keyAll.length === 0 ? params : params.filter(({ idx }) => keyAll.find((item) => item.idx !== idx))
        if (clearParams.length > 0) {
            const results: any[] = []
            const categoriaKeys = getKeys(1)
            const conceptoKeys = getKeys(2)
            const pagoKeys = getKeys(4)
            const responsableKeys = getKeys(6)

            data.forEach((item) => {
                const conceptoKey = item?.concepto?.includes("/") ? item.concepto.split("/")[0].trim() : item.concepto
                const finalConceptoKey =
                    conceptoKey === "reserva"
                        ? "Propina reserva"
                        : conceptoKey === "renta"
                        ? "Propina renta"
                        : conceptoKey
                if (
                    findValue(categoriaKeys, item?.categoria) &&
                    findValue(conceptoKeys, finalConceptoKey) &&
                    findValue(pagoKeys, getPaymentKey(item?.tipo_pago)) &&
                    findValue(responsableKeys, item?.responsable)
                ) {
                    results.push(item)
                }
            })

            setRows(getRowFormat([...results]))
        } else {
            setRows(getRowFormat([...data]))
        }
    }

    return { rows, handleSort, handleFilter }
}
