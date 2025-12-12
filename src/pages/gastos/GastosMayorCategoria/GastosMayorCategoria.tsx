import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import LargeCardGMC from "src/shared/components/data-display/LargeCardGMC/LargeCardGMC"
import Screen from "src/shared/components/layout/screen/Screen"
import "./GastosMayorCategoria.css"
import { useGetGastosCategorasPorMesQuery, useGetGastosDelMesQuery } from "src/gql/schema"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import EmptyState from "src/shared/components/layout/empty-state/EmptyState"
import { months } from "src/utils/date"

import LargeCardSkeleton from "../../../shared/components/data-display/LargeCardSkeleton/LargeCardSkeleton"
import { useProfile } from "src/shared/hooks/useProfile"
const GastosCategoria = () => {
    const { month = "" } = useParams()
    const { hotel_id } = useProfile()
    const { data, error, loading } = useGetGastosDelMesQuery({
        variables: {
            month: (parseInt(month) + 1).toString(),
            hotel_id,
        },
    })

    const { data: categorias } = useGetGastosCategorasPorMesQuery({
        variables: {
            gastosCategoria: (parseInt(month) + 1).toString(),
            hotel_id,
        },
    })

    const orderedList = (list) => {
        let percents: GLfloat[] = []
        list?.map((card) => {
            percents.push(parseFloat(card.porcentaje))
        })
        percents = percents.sort(function (a, b) {
            return b - a
        })
        let listArray: any[] = []
        percents.map((percent) => {
            list.map((card) => {
                if (parseFloat(card.porcentaje) === percent) {
                    listArray.push(card)
                }
            })
        })
        const hash = {}
        listArray = listArray.filter((ar) =>
            hash[ar.categoria.categoria] ? false : (hash[ar.categoria.categoria] = true)
        )
        return listArray
    }

    const newList = orderedList(categorias?.gastos_categoria_por_mes)
    const navigate = useNavigate()
    const total = data?.gastos_por_mes?.total_gasto || 0
    if (error) return <></>
    if (loading) return <LargeCardSkeleton />

    return (
        <Screen onClose={() => navigate(-1)} title={"Gastos de " + months[month] + " por categorías"} close={true}>
            <div className="gastos-mayor-categoria">{`${formatCurrency(total || 0)}`}</div>
            <div className="gastos-mayor-categoria__main__wrapper">
                <div className="gastos-mayor-categoria__main">
                    {data && newList?.map((gasto, index) => <LargeCardGMC key={index} categoria={gasto} />)}
                    {!data && (
                        <div className="gastos-mayor-categoria-notData">
                            <EmptyState headerIcon="bankNote" title="No se encuentran gastos" />
                        </div>
                    )}
                </div>
            </div>
        </Screen>
    )
}

export default GastosCategoria
