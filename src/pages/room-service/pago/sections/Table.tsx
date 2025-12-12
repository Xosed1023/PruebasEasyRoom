import React from "react"
import Checkbox from "src/shared/components/forms/checkbox/Checkbox"
import { getCurrencyFormat } from "src/utils/string"

const headers = ["Folio", "Detalle", "Precio", "Cantidad", "IVA", "Total", "Pagar"]

type TableProps = {
    data: any[][]
    checked: boolean[]
    onSelectionChange: (index: number) => void
}

export const Table = ({ data = [], checked, onSelectionChange }: TableProps) => {
    return (
        <div className="rs-pago__table">
            <div className="rs-pago__table-head rs-pago__table-row">
                {headers.map((header, index) => (
                    <div key={index} className="rs-pago__table-title">
                        {header}
                    </div>
                ))}
            </div>

            <div className="rs-pago__table-content">
                
                {data?.map((row, rowIndex) => {
                    const isChecked = checked[rowIndex] || false
                    return (
                        <div className="rs-pago__table-row rs-pago__table-row-body" key={rowIndex}>
                            {row?.map((value, index) => {
                                return Array.isArray(value) ? (
                                    <div
                                        className="rs-pago__table-cell rs-pago__table-cell-expand"
                                        style={{ padding: 0 }}
                                        key={index}
                                    >
                                        {value.map(
                                            (
                                                { name = "", number = "", cost = 0, iva = 0, total = 0, extras = [] },
                                                index
                                            ) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <div className="rs-pago__table-cell__item">
                                                            <span>{name}</span>
                                                            <span>{getCurrencyFormat(cost)}</span>
                                                            <span>{number}</span>
                                                            <span>{getCurrencyFormat(iva)}</span>
                                                            <span>{getCurrencyFormat(total)}</span>
                                                        </div>
                                                        {extras?.length > 0 &&
                                                        extras?.map((e, extraIndex) => (
                                                            <div className="rs-pago__table-cell__item" key={extraIndex}>
                                                                <span style={{ paddingLeft: 30 }}>{e?.name}</span>
                                                                <span>{getCurrencyFormat(e?.cost)}</span>
                                                                <span>{e?.number}</span>
                                                                <span>{getCurrencyFormat(e?.iva)}</span>
                                                                <span>{getCurrencyFormat(e?.total)}</span>
                                                            </div>
                                                        ))}
                                                    </React.Fragment>
                                                )
                                            }
                                        )}
                                    </div>
                                ) : (
                                    <div className="rs-pago__table-cell" key={index}>
                                        {value}
                                    </div>
                                )
                            })}

                            <div className="rs-pago__table-cell-check" key={row.length}>
                                <Checkbox
                                    value={isChecked}
                                    onChange={() => onSelectionChange(rowIndex)}
                                    iconColorWhenChecked="white"
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
