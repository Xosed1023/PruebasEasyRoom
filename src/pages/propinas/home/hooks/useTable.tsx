import { useEffect, useState } from "react"
import { getExactDate } from "src/utils/date"
import { getCurrencyFormat } from "src/utils/string"
import { getName } from "../helpers/name"
import { TiposPagos } from "src/gql/schema"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

export function useRows(data: any[]) {
    const [rows, setRows] = useState<any[]>([])
    const { formatCustomDate } = useFormatDate()

    const getRowFormat = (list: any[]) => {
        const orderList =
            list.sort((a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime()) || []
        return orderList.map((item: any) => {
            const base = [
                { value: item?.folio },
                {
                    value: formatCustomDate(getExactDate(item?.fecha_registro), "MMM, DD YYYY - hh:mm A")

                },
                {
                    value: item?.turno?.nombre || "",
                },
                { value: getName(item?.colaborador) },
                {
                    value:
                        item?.procedencia === "roomservice"
                            ? "Room service"
                            : item?.procedencia === "renta"
                            ? "Venta de habitación"
                            : item?.procedencia === "reserva"
                            ? "Reserva de habitación"
                            : item?.procedencia === "restaurante"
                            ? "Restaurante"
                            : "Otro",
                },
                {
                    value:
                        item?.habitacion?.numero_habitacion ||
                        (item?.mesa?.numero_mesa ? `Mesa ${item?.mesa?.numero_mesa}` : "") ||
                        "N/A",
                },
                {
                    value: (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span>
                                {item?.detalles_pago?.length > 1
                                    ? "Mixto"
                                    : item?.detalles_pago?.[0]?.tipo_pago === "efectivo"
                                    ? "Efectivo"
                                    : item?.detalles_pago?.[0]?.tipo_pago === TiposPagos.VisaOMastercard
                                    ? "Visa o Mastercard"
                                    : "Amex"}
                            </span>

                            {(item?.detalles_pago?.length > 1 ||
                                item?.detalles_pago?.[0]?.tipo_pago !== "efectivo") && (
                                <span style={{ color: "var(--placeholder)", fontSize: "12px" }}>
                                    {item?.detalles_pago
                                        ?.map((p) => p.numero_referencia || p.ultimos_digitos)
                                        .filter(Boolean)
                                        .join(", ")}
                                </span>
                            )}
                        </div>
                    ),
                },
                { value: getCurrencyFormat(item?.total || 0) },
                { value: item?.comentarios || "-" },
                {
                    value: {
                        corte_id: item?.corte_id,
                        propina_id: item?.propina_id,
                    },
                },
            ]
            return {
                value: base,
                eliminado: item?.eliminado,
            }
        })
    }

    useEffect(() => {
        if (data?.length > 0) {
            setRows(data)
        } else {
            setRows([])
        }
    }, [data])

    const handleFilter = (params: any[]) => {
        const getKeys = (id) => clearParams.filter(({ idx }) => idx === id).map(({ filter }) => filter)
        const findValue = (keys: string[], value: string) => (keys.length > 0 ? keys.includes(value) : true)

        const keyAll = params.filter(({ filter }) => filter === "todos")

        const clearParams =
            keyAll.length === 0
                ? params
                : params.filter(({ idx, filter }) => filter !== "todos" && keyAll.find((item) => item.idx !== idx))

        if (clearParams.length > 0) {
            const results: any[] = []
            const turnoKeys = getKeys(2)
            const colaboradorKeys = getKeys(3)
            const origenKeys = getKeys(4)
            const pagoKeys = getKeys(6)

            data.forEach((item) => {
                if (
                    findValue(turnoKeys, item?.turno?.nombre) &&
                    findValue(colaboradorKeys, item?.colaborador_id) &&
                    findValue(origenKeys, item?.procedencia) &&
                    findValue(pagoKeys, item?.detalles_pago?.length > 1 ? "mixto" : item?.detalles_pago?.[0]?.tipo_pago)
                ) {
                    results.push(item)
                }
            })

            setRows(results)
        } else {
            setRows(data)
        }
    }

    return { rows: getRowFormat(rows), dinamycData: rows, handleFilter }
}
