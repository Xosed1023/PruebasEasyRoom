export interface PieChartIncomeProps {
    title: string
    data: {
        id: string
        label: string
        value: number
        color: string
    }[]
}