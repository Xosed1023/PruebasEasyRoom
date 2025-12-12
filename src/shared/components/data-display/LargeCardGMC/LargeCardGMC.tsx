import React, { useEffect } from "react"
import cx from "classnames"
import Icon from "src/shared/icons"
import { useState } from "react"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import "./LargeCardGMC.css"
const LargeCardGMC = ({ categoria }) => {
    const [subcategorias, setSubcategorias] = useState<any[]>([])
    const totalSubs = categoria?.categoria?.subcategorias_de_categoria
    const montosSubs = categoria?.subcategorias
    const newSubs: any[] = []

    useEffect(() => {
        totalSubs?.map((sub) => {
            montosSubs?.map((montoSub) => {
                if (sub?.subcategoria_gasto_id === montoSub?.subcategoria_gasto_id) {
                    newSubs?.map((newSub, index) => {
                        if (newSub.nombre === sub?.subcategoria) {
                            newSubs.pop()
                        }
                    })
                    newSubs.push({ nombre: montoSub?.subcategoria, monto: montoSub?.monto })
                } else {
                    let exists = false
                    newSubs?.map((newSub) => {
                        if (newSub.nombre === sub?.subcategoria) {
                            exists = true
                        }
                    })
                    if (exists === false) newSubs.push({ nombre: sub?.subcategoria, monto: 0 })
                }
            })
        })

        if (totalSubs.length > 0 && newSubs.length === 0) {
            totalSubs?.map((sub) => {
                newSubs.push({ nombre: sub?.subcategoria, monto: 0 })
            })
        }

        newSubs.sort((a, b) => b.monto - a.monto);

        setSubcategorias(newSubs)
    }, [categoria])

    const [isExpanded, setIsExpanded] = useState(false)
    return (
        <div className={cx("largecard__container")}>
            <div className={cx("card")}>
                <div className="largecard-left">
                    <p className="gastos-mayor-categoria__title">{categoria.categoria.categoria}</p>
                    <div className="card-content-line">
                        <p className="card-content-line-title">Presupuesto disponible:</p>
                        <p className="card-content-line-presupuesto">
                            {categoria.categoria.presupuesto
                                ? formatCurrency(Number(categoria.categoria.presupuesto))
                                : "Sin asignar"}
                        </p>
                    </div>
                </div>

                <div className="largecard-right">
                    <div className="chevroUp-button-GMC">
                        <div className="largecard-right__totalPAgado">
                            {formatCurrency(Number(categoria.total_gasto))}
                        </div>
                        <div
                            className="largecard-right__etiquetaPorsent"
                            style={{
                                marginRight:
                                    categoria?.categoria?.subcategorias_de_categoria?.length > 0 ? "0px" : "75px",
                            }}
                        >
                            {categoria.porcentaje.toFixed(2)}%
                        </div>
                        <Icon
                            onClick={() => setIsExpanded(!isExpanded)}
                            width={"35px"}
                            height={"35px"}
                            name="chevronUp"
                            className={"drop"}
                            style={{
                                transform: ` ${isExpanded ? "translateX(-40%)" : ""} rotate(${
                                    isExpanded ? "-180deg" : "0deg"
                                })`,
                                marginLeft: "15px",
                                display: categoria?.categoria?.subcategorias_de_categoria?.length > 0 ? "flex" : "none",
                            }}
                        />
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="card-content-sub-group">
                    <p className="card-sub-group-title">Sub categorías ({subcategorias?.length})</p>
                    <div className="card-sub-group-subcategorias">
                        {subcategorias?.map((sub, index) => (
                            <div
                                className="card-subcategoria-content"
                                key={index}
                                style={{ justifyContent: "space-between", width: "80%" }}
                            >
                                <div className="card-subcategoria-name">
                                    <p style={{ marginRight: 5 }}>{index + 1}.</p>
                                    <p style={{ width: "95%"}}>{sub.nombre}</p>
                                </div>
                                <p>{formatCurrency(Number(sub.monto))}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default LargeCardGMC
