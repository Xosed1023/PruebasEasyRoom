import React, { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { GetGastosCategorasPorMesCardsQuery } from "src/gql/schema"
import Card from "src/shared/components/data-display/card/Card"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import SkeletonCards from "../SkeletonCard/SkeletonCard"
import { getCardList } from "./CardGastosList.helpers"
import { months } from "src/utils/date"

interface DataCards {
    title?: string
    number?: string
    percent?: string
    link?: string
    onLink?: () => void
}

const CardsGastosList = ({
    gastosDelMes,
    loadingGM,
    month,
}: {
    gastosDelMes: GetGastosCategorasPorMesCardsQuery
    loadingGM: boolean
    month: number
}) => {
    const navigate = useNavigate()
    const orderedList = (
        list: {
            porcentaje: number
            total_gasto: number
            name: string;
        }[]
    ) => {
        list = [...list].sort(function (a, b) {
            return b.porcentaje - a.porcentaje
        })
        return list.map((gasto) => ({
            title: gasto.name + "",
            number: formatCurrency(gasto.total_gasto) + "",
            percent: gasto.porcentaje + ""
        }))
    }

    const dataCards: DataCards[] = useMemo(() => {
        if (gastosDelMes.gastos_categoria_por_mes) {
            const { list, total } = getCardList(gastosDelMes)

            const newList = orderedList(list)
            return [
                {
                    title: `Total de gastos ${months[month]}`,
                    number: `${formatCurrency(total || 0)}`,
                    link: "Ver todas las categorías",
                    onLink: () => {
                        navigate("/u/gastos/categoria/" + month)
                    },
                },
                ...newList,
            ]
        } else {
            return []
        }
    }, [gastosDelMes])

    if (loadingGM) return <SkeletonCards />

    return (
        <>
            {dataCards.map((data, index) => (
                <Card
                    containerClassName={
                        month === 8 ? "card-gastos-big" : month >= 10 ? "card-gastos-big" : "card-gastos"
                    }
                    key={index}
                    title={data.title || ""}
                    number={data.number || "0"}
                    percent={data.percent}
                    link={data.link}
                    onLink={data.onLink}
                />
            ))}
        </>
    )
}

export default CardsGastosList
