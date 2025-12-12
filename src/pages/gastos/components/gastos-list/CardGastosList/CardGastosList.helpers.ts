import { GetGastosCategorasPorMesCardsQuery } from "src/gql/schema"
import { sum } from "src/shared/helpers/calculator"

export function getCardList(data: GetGastosCategorasPorMesCardsQuery) {
    const gastosCards = data.gastos_categoria_por_mes?.map(({ porcentaje, total_gasto, categoria }) => {
        return {
            name: categoria.categoria,
            porcentaje,
            total_gasto
        }
    }) || []

    const total = sum(gastosCards?.map(g => g.total_gasto) || [])

    return {
        list: gastosCards,
        total,
    }
}
