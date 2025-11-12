import Icon from "src/shared/icons"
import "./ResumenTicket.css"
import { Button } from "src/shared/components/forms"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import SkeletonTicket from "../SkeletonTicket/SkeletonTicket"
import { useFetch } from "../../../../shared/hooks/useFetch"
import { useProfile } from "src/shared/hooks/useProfile"
import { useDataResumen } from "./hooks/useDataResumen"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { setTotal } from "src/store/cortes/cortesSlice"
import { GetCorteQuery, useGetCorteLazyQuery } from "src/gql/schema"
import { minus } from "src/shared/helpers/calculator"
import { ResumenPagos } from "../../Sections/ResumenTurno/interfaces/resumenPagos"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import corteDiaOpener from "src/shared/openers/corteDiaOpener"

export interface Props {
    fecha_cierre: string | null | undefined
    turno_id?: string
    fecha_inicio?: string
    fecha_fin?: string
    corte_id?: string
    loading?: boolean
}

function ResumenTicket(props: Props): JSX.Element {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { fecha_cierre, fecha_fin, fecha_inicio, turno_id, corte_id, loading } = props
    const { hotel_id, usuario_id } = useProfile()
    const { efectivo_ingresado } = useSelector((state: RootState) => state.cortes)

    const [getCorte] = useGetCorteLazyQuery()
    const [corteSelected, setcorteSelected] = useState<GetCorteQuery>()

    const {
        data: resumen_pagos,
        load,
        refetch: refetchResumenPagos,
    } = useFetch<ResumenPagos>("/cortes/resumen_pagos", {
        startFetch: false,
    })

    useEffect(() => {
        if (corte_id) {
            getCorte({
                variables: {
                    corte_id,
                },
            }).then(({ data }) => {
                setcorteSelected(data)
            })
        }
    }, [corte_id])

    useEffect(() => {
        if (turno_id && !loading) {
            const fechas = {
                fecha_inicio,
                fecha_fin,
            }
            const variables = {
                usuario_id,
                turno_id,
                hotel_id,
                ...(fecha_inicio ? { ...fechas } : {}),
            }
            refetchResumenPagos(variables)
        }
    }, [turno_id, fecha_inicio, loading])

    const { dataResumen, dataIngresos } = useDataResumen(resumen_pagos)

    useEffect(() => {
        if (dataResumen?.total) {
            dispatch(setTotal(dataResumen.total))
        }
    }, [dataResumen])

    const [diferencia, setDiferencia] = useState(0)

    useEffect(() => {
        if (resumen_pagos || efectivo_ingresado) {
            setDiferencia(
                efectivo_ingresado
                    ? minus(resumen_pagos?.efectivo_disponible_recepcion || 0, efectivo_ingresado || 0)
                    : minus(resumen_pagos?.efectivo_disponible_recepcion || 0, corteSelected?.corte?.efectivo_ingresado || 0)
            )
        }

    }, [resumen_pagos, corteSelected, efectivo_ingresado])

    return (
        <div className="resumen-ticket__main">
            <div className="resumen-ticket__container-main">
                {load ? (
                    <SkeletonTicket />
                ) : (
                    <div>
                        <div className="resumen-ticket__body">
                            <div className="resumen-ticket__container-ingresos">
                                <p className="resumen-ticket__title">Ingresos</p>
                                {dataResumen?.ingresos.map(({ title, items, total }, index) => (
                                    <div key={index}>
                                        <div className="resumen-ticket__subtitle-container">
                                            <Icon name={title.icon} />
                                            <p className="resumen-ticket__subtitle">{title.text}</p>
                                        </div>
                                        {items.map(({ text, value, icon }, index) => (
                                            <div className="resumen-ticket__values-container" key={index}>
                                                {icon && <Icon name={icon} />}
                                                <p className="resumen-ticket__label">{text}</p>
                                                <p className="resumen-ticket__value">{value}</p>
                                            </div>
                                        ))}
                                        <div className="resumen-ticket__total-container">
                                            <p className="resumen-ticket__total-label">{total.text}</p>
                                            <p className="resumen-ticket__total-label">{total.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <>
                                <p className="resumen-ticket__title">Egresos</p>
                                <>
                                    {dataResumen?.egresos.map(({ title, items, total }, index) => (
                                        <div key={index}>
                                            <div className="resumen-ticket__subtitle-container">
                                                <Icon name={title.icon} />
                                                <p className="resumen-ticket__subtitle">{title.text}</p>
                                            </div>
                                            {items.map(({ text, value, icon }, index) => (
                                                <div className="resumen-ticket__values-container" key={index}>
                                                    {icon && <Icon name={icon} />}
                                                    <p className="resumen-ticket__label">{text}</p>
                                                    <p className="resumen-ticket__value">{value}</p>
                                                </div>
                                            ))}
                                            <div className="resumen-ticket__total-container">
                                                <p className="resumen-ticket__total-label">{total.text}</p>
                                                <p className="resumen-ticket__total-label">{total.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            </>
                            <div className="resumen-ticket__subtotal-container">
                                <p className="resumen-turno-ticket__title">Resumen</p>
                                <div className="resumen-ticket__subtotal-labels">
                                    <p className="resumen-ticket__subtotal__label">Ingresos</p>
                                    <p className="resumen-ticket__subtotal__value">
                                        {formatCurrency(Number(dataResumen.total_ingresos || 0))}
                                    </p>
                                </div>
                                {dataIngresos.map(({ text, value }, index) => (
                                    <div className="resumen-ticket__subtotal-items" key={index}>
                                        <p className="resumen-ticket__subtotal__item-label">{text}</p>
                                        <p className="resumen-ticket__subtotal__item-value">{value}</p>
                                    </div>
                                ))}
                                <div className="resumen-ticket__subtotal-labels">
                                    <p className="resumen-ticket__subtotal__label">Egresos</p>
                                    <p className="resumen-ticket__subtotal__value">
                                        -{formatCurrency(Number(resumen_pagos?.total_gastos || 0))}
                                    </p>
                                </div>
                                {dataResumen?.egresos.map(({ items }, index) => (
                                    <div key={index}>
                                        {items.map(({ text, value }, index) => (
                                            <div className="resumen-ticket__subtotal-items" key={index}>
                                                <p className="resumen-ticket__subtotal__item-label">{text}</p>
                                                <p className="resumen-ticket__subtotal__item-value">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="resumen-ticket__subtotal-footer">
                            <div className="resumen-ticket__subtotal-container">
                                <p className="resumen-turno-ticket__title">Efectivo</p>
                                <div className="resumen-ticket__subtotal-labels">
                                    <p className="resumen-ticket__subtotal__label">Efectivo calculado</p>
                                    <p className="resumen-ticket__subtotal__value">
                                        {formatCurrency(Number(resumen_pagos?.efectivo_disponible_recepcion || 0))}
                                    </p>
                                </div>
                                <div className="resumen-ticket__subtotal-labels">
                                    <p className="resumen-ticket__subtotal__label">Efectivo ingresado</p>
                                    <p className="resumen-ticket__subtotal__value">
                                        {efectivo_ingresado 
                                            ? formatCurrency(Number(efectivo_ingresado || 0))
                                            : formatCurrency(Number(corteSelected?.corte?.efectivo_ingresado || 0))}
                                    </p>
                                </div>
                                <div className="resumen-ticket__subtotal-items">
                                    <p className="resumen-ticket__subtotal__item-label">Faltante</p>
                                    <p className="resumen-ticket__subtotal__item-value">
                                        {efectivo_ingresado || corteSelected?.corte?.efectivo_ingresado
                                            ? diferencia > 0
                                                ? formatCurrency(Math.abs(diferencia))
                                                : formatCurrency(0)
                                            : formatCurrency(Number(resumen_pagos?.efectivo_disponible_recepcion || 0))}
                                    </p>
                                </div>
                                <div className="resumen-ticket__subtotal-items">
                                    <p className="resumen-ticket__subtotal__item-label">Sobrante</p>
                                    <p className="resumen-ticket__subtotal__item-value">
                                        {formatCurrency(diferencia < 0 ? Math.abs(diferencia) : 0)}
                                    </p>
                                </div>
                                <div className="resumen-ticket__subtotal-labels">
                                    <p className="resumen-ticket__total">Total</p>
                                    <p className="resumen-ticket__total">
                                        {formatCurrency(Number(dataResumen.total || 0))}
                                    </p>
                                </div>
                            </div>
                            <div className="resumen-ticket__container-buttons">
                                <Button
                                    text={!fecha_cierre ? "Cerrar corte" : "Imprimir corte"}
                                    className={`resumen-ticket__button ${fecha_cierre ? "resumen-ticket__button-resumen" : ""}`}
                                    onClick={() =>
                                        !fecha_cierre
                                            ? corte_id
                                                ? navigate(`/u/cortes/crear-corte/${corte_id}`)
                                                : navigate(`/u/cortes/crear-corte`)
                                            : corteDiaOpener({
                                                stateCorteHistorial: {
                                                    corte_id: corte_id || "",
                                                },
                                            })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* <div className="resumen-turno__nota">
                *Los montos de cortesías y consumo interno no están incluidas en el cálculo del corte
            </div> */}
        </div>
    )
}

export default ResumenTicket
