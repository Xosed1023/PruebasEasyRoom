import { useMemo } from "react"
import { Button } from "src/shared/components/forms"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"
import "./CortePropina.css"

type CortePropinaProps = {
    onConfirm: () => void
    res: any[]
    loading: boolean
    totals: string[]
}

export const headers = [
    "Personal",
    "Estancia",
    "Alimentos",
    "Bebidas",
    "Sex&Spa",
    "Otros",
    "Propinas\npor venta",
    "Puntos\na pagar",
    "Comisión bancaria",
    "Pago\ncorrespondiente",
]

const list = [1, 2, 3, 4, 5, 6, 7]

function CortePropina({ res, loading, totals, onConfirm }: CortePropinaProps): JSX.Element {
    const data = useMemo(() => {
        const array: string[][] = []
        if (res.length > 0) {
            res.forEach(({ section = "", values = [] }) => {
                values.forEach(({ value = [] }) => {
                    const [name = "", ...rest] = value
                    array.push([`${name}|${section}`, ...rest])
                })
            })
        }
        return array
    }, [res])

    return (
        <section className="corte-propina">
            <p className="corte-propina__title">
                {"Antes de cerrar el turno,\nRevisa el detalle de pago de propinas de los vendedores del turno."}
            </p>
            <section className="corte-propina__table">
                <div className="corte-propina__table-thead corte-propina__table-grid">
                    {headers.map((header, index) => (
                        <div className="corte-propina__table-cell corte-propina__table-th" key={index}>
                            {header}
                        </div>
                    ))}
                </div>
                <div className="corte-propina__table-tbody">
                    {loading ? (
                        list.map((i) => (
                            <div key={i} className="corte-propina__table-row corte-propina__table-skeleton-row">
                                <Skeleton.Item className="corte-propina__table-skeleton" />
                            </div>
                        ))
                    ) : data.length > 0 ? (
                        data.map((row, i) => (
                            <div className="corte-propina__table-row corte-propina__table-grid" key={i}>
                                {row.map((value, index) => {
                                    return index === 0 ? (
                                        <CellName key={index} value={value} />
                                    ) : (
                                        <div className="corte-propina__table-cell corte-propina__table-td" key={index}>
                                            {value}
                                        </div>
                                    )
                                })}
                            </div>
                        ))
                    ) : (
                        <div></div>
                    )}
                </div>
                <div className="corte-propina__table-tfooter corte-propina__table-grid">
                    {totals.map((header, index) => (
                        <div className="corte-propina__table-cell corte-propina__table-total" key={index}>
                            {header}
                        </div>
                    ))}
                </div>
            </section>
            <Button className="corte-propina__btn" text={"Pagar propinas y continuar"} onClick={onConfirm} />
        </section>
    )
}

const CellName = ({ value }) => {
    const array = value?.split("|") || []
    return (
        <div className="corte-propina__table-cell corte-propina__table-name">
            <span className="corte-propina__table-name-title">{array?.[0] || ""}</span>
            <span className="corte-propina__table-name-label">{array?.[1] || ""}</span>
        </div>
    )
}

export default CortePropina
