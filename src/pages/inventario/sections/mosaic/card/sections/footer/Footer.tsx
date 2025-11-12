import React, { useEffect, useState } from "react"

import "./Footer.css"
import { Button } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { useDispatch } from "react-redux"
import {
    setIsModalActivateProductFromMosaicOpen,
    setIsModalRefillProductFromMosaicOpen,
} from "src/store/inventario/inventario.slice"
import { EstadosAlmacenesArticulos, EstadosArticulo, TipoArticulo, UnidadMedidasArticulo } from "src/gql/schema"
import measurementToStock from "src/pages/inventario/helpers/measurementToStock"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
interface FooterProps {
    // límite para mostrar si hay buen stock (verde) o está próximo a agotarse (amarillo)
    units: number
    estadoArticulo: EstadosArticulo
    estadoAlmacenArticulo: EstadosAlmacenesArticulos
    onClickButton: () => void
    measurement: UnidadMedidasArticulo
    type: TipoArticulo
}

const Footer = ({ estadoAlmacenArticulo, estadoArticulo, units, onClickButton, type, measurement }: FooterProps) => {
    const [statusClass, setstatusClass] = useState("inventory-card__footer__units--success")
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const dispatch = useDispatch()

    useEffect(() => {
        if (estadoAlmacenArticulo === EstadosAlmacenesArticulos.PorAgotarse) {
            return setstatusClass("inventory-card__footer__units--alert")
        }
        if (estadoAlmacenArticulo === EstadosAlmacenesArticulos.Agotado) {
            return setstatusClass("inventory-card__footer__units--danger")
        }
        return setstatusClass("inventory-card__footer__units--success")
    }, [units])

    const setContent = () => {
        if (estadoArticulo === EstadosArticulo.Desactivado) {
            return (
                <Button
                    type="button"
                    text="Activar"
                    className="inventory-card__footer__button"
                    onClick={validateIsColabActive((e) => {
                        e.stopPropagation()
                        onClickButton()
                        dispatch(setIsModalActivateProductFromMosaicOpen(true))
                    })}
                ></Button>
            )
        }
        if (type === TipoArticulo.Venta || type === TipoArticulo.Insumo) {
            return (
                <Button
                    type="button"
                    text="Resurtir"
                    className="inventory-card__footer__button"
                    onClick={validateIsColabActive((e) => {
                        e.stopPropagation()
                        onClickButton()
                        dispatch(setIsModalRefillProductFromMosaicOpen(true))
                    })}
                ></Button>
            )
        }
    }

    return (
        <div className="inventory-card__footer">
            <div className="inventory-card__footer__units__wrapper">
                {setContent()}
                <div className="inventory-card__footer__units">
                    <div className="inventory-card__footer__units__main">
                        <span className={`inventory-card__footer__units__label ${statusClass}`}>
                            {units} {measurementToStock(type, measurement)}
                        </span>
                        <Icon
                            name="packageFill"
                            width={16}
                            height={16}
                            color={
                                units <= 0
                                    ? "var(--timer-ocupada)"
                                    : estadoAlmacenArticulo === EstadosAlmacenesArticulos.PorAgotarse
                                    ? "var(--cancelada)"
                                    : "var(--disponible)"
                            }
                        ></Icon>
                    </div>
                </div>
            </div>
            {InactiveModal}
        </div>
    )
}

export default Footer
