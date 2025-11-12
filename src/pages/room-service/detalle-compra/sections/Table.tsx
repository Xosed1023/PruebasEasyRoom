import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import cx from "classnames"
import { useFieldArray, useFormContext, Controller } from "react-hook-form"
import Icon from "src/shared/icons"
import CloseModal from "./modals/CloseModal"
import { InputNumber } from "./Elements"
import { getCurrencyFormat } from "src/utils/string"
import { removeItems } from "../DetalleCompra.helpers"

const headers = ["#", "Producto", "Categoría", "Cantidad", "Precio", "Eliminar"]

function RowField({ rows, rowIndex, row, onRemove, accessName, numberIndex }): JSX.Element {
    const { control } = useFormContext()
    return (
        <div className="detalle-compra__table-row" style={{ minHeight: 60, height: "auto" }}>
            {rows?.[rowIndex]?.map((value, index) => (
                <div
                    className={cx({
                        "detalle-compra__table-cell": true,
                        "detalle-compra__table-cell-input": index === 3,
                    })}
                    key={index}
                >
                    {index === 0 ? (
                        numberIndex
                    ) : index === 1 ? (
                        <div style={{ width: "100%", padding: row?.["comment"] ? "16px 0" : 0 }}>
                            <span className="detalle-compra__table-cell-name">{value}</span>
                            {row?.["comment"] && (
                                <div className="detalle-compra__table-cell-comment">
                                    <Icon name={"chatLeft"} color={"var(--tipografa)"} />
                                    {row?.["comment"]}
                                </div>
                            )}
                        </div>
                    ) : index === 3 ? (
                        <Controller
                            control={control}
                            name={accessName}
                            rules={{ required: true, min: 1 }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <InputNumber
                                    value={`${value}`}
                                    onChange={(value) => onChange(Number(value || 0))}
                                    error={!!error}
                                />
                            )}
                        />
                    ) : index === 5 ? (
                        <Icon
                            className="detalle-compra__table-cell-remove"
                            name={"trashFilled"}
                            color={"var(--primary)"}
                            onClick={onRemove}
                        />
                    ) : (
                        value
                    )}
                </div>
            ))}
        </div>
    )
}

function Extras({ index, numberIndex }) {
    const { control } = useFormContext()

    const { fields, remove } = useFieldArray({ control, name: `products.${index}.extras` })

    const rows = useMemo(() => {
        return fields.map((item, index) => {
            return [`${index + 1}`, item?.["name"], item?.["category"], "", getCurrencyFormat(item?.["cost"]), ""]
        })
    }, [fields])

    return (
        <>
            {fields.map((row, rowIndex) => (
                <RowField
                    key={row.id}
                    accessName={`products.${index}.extras.${rowIndex}.number`}
                    numberIndex={`${numberIndex + rowIndex + 1}`}
                    row={row}
                    rowIndex={rowIndex}
                    rows={rows}
                    onRemove={() => remove(rowIndex)}
                />
            ))}
        </>
    )
}

export const Table = ({ editMode = false, isDetalleOrden = false }) => {
    const [visible, setVisible] = useState<boolean>(false)
    const { control } = useFormContext()
    const { fields, remove } = useFieldArray({ control, name: "products" })

    const navigate = useNavigate()

    const rows = useMemo(() => {
        return fields.map((item, index) => {
            return [`${index + 1}`, item?.["name"], item?.["category"], "", getCurrencyFormat(item?.["cost"]), ""]
        })
    }, [fields])

    return (
        <div
            className={cx({
                "detalle-compra__table": true,
                "detalle-compra__table-edit": editMode,
            })}
            style={{
                height: isDetalleOrden ? "auto" : fields.length <= 2 ? "170px" : "290px",
                maxHeight: isDetalleOrden ? "550px" : "none",
                overflowY: isDetalleOrden ? "auto" : fields.length > 2 ? "auto" : "hidden",
            }}
        >
            <div className="detalle-compra__table-head detalle-compra__table-row">
                {headers.map((header, index) => (
                    <div key={index} className="detalle-compra__table-title">
                        {header}
                    </div>
                ))}
            </div>
            <div className="detalle-compra__table-content">
                {fields?.map((row, rowIndex) => {
                    const beforeIndex = fields?.[rowIndex - 1]?.["extras"]?.length || 0
                    return (
                        <>
                            <RowField
                                numberIndex={beforeIndex + 1 + rowIndex}
                                key={row.id}
                                accessName={`products.${rowIndex}.number`}
                                row={row}
                                rowIndex={rowIndex}
                                rows={rows}
                                onRemove={() =>
                                    fields.length === 1 && !editMode ? setVisible(true) : remove(rowIndex)
                                }
                            />
                            {fields?.[rowIndex]?.["extras"]?.length > 0 && (
                                <Extras key={`${row.id}_${rowIndex}`} index={rowIndex} numberIndex={beforeIndex + 1} />
                            )}
                        </>
                    )
                })}
            </div>
            <CloseModal
                editMode={editMode}
                visible={visible}
                onClose={() => setVisible(false)}
                onConfirm={() => {
                    removeItems()
                    if (!editMode) {
                        navigate(-1)
                    } else {
                        navigate("/u", { replace: true })
                    }
                }}
            />
        </div>
    )
}
