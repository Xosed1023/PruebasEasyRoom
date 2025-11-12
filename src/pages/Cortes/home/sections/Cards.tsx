import cx from "classnames"
import { useMemo } from "react"
import Card from "src/shared/components/data-display/card/Card"
import { getCurrencyFormat } from "src/utils/string"

export const Cards = ({ data, onLinkFajillas }: { data: any; onLinkFajillas: () => void }) => {
    const dataCards = useMemo(() => {
        return [
            {
                title: "Total del turno",
                number: getCurrencyFormat(data?.total_ventas || 0),
                className: "cortes-screen__card-item-total",
            },
            {
                title: "Visa y mastercard",
                number: getCurrencyFormat(data?.visa_mastercard || 0),
                title2: "AMEX",
                number2: getCurrencyFormat(data?.amex || 0),
            },
            {
                title: "Tranferencias y depósitos",
                number: getCurrencyFormat(data?.depositos_transfer || 0),
            },
            {
                title: "Efectivo en caja",
                number: getCurrencyFormat(data?.efectivo_caja && data?.efectivo_caja > 0 ? data?.efectivo_caja : 0),
                effectitrack: getCurrencyFormat(
                    data?.disponible_retiro && data?.disponible_retiro > 0 ? data?.disponible_retiro : 0
                ),
            },
            {
                title: "Efectivo retirado",
                number: getCurrencyFormat(data?.total_fajillas || 0),
                link: data?.cantidad_fajillas > 0 ? "Ver detalle" : "",
                onLink: onLinkFajillas,
            },
            {
                title: "Consumo interno",
                number: getCurrencyFormat(data?.consumo_interno || 0),
                title2: "Easyrewards",
                number2: getCurrencyFormat(data?.easy_rewards || 0),
            },
            {
                title: "Gastos de caja",
                number: getCurrencyFormat(data?.gastos ? Number(data?.gastos) * -1 : 0),
                className: "cortes-screen__card-item-caja",
            },
        ]
    }, [data])

    return (
        <div className="cortes-screen__cards animante__select">
            {dataCards.map(({ className = "", ...item }, index) => (
                <Card
                    key={index}
                    containerClassName={cx("cortes-screen__card-item", className)}
                    className={"cortes-screen__card__contain"}
                    percent={""}
                    {...item}
                />
            ))}
        </div>
    )
}
