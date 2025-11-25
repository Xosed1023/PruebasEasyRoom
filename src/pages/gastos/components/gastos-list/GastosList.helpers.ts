import { createDateUtils } from "src/shared/hooks/useDate"

export const getSortList = (array: any[]) => {
    return array.sort((a, b) => new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime()) || []
}

export const getFilterDate = (year: string, month: string, currentDate: Date) => {
    const {localDateToUTCString} = createDateUtils()
    const selectedYear = year ? Number(year) : currentDate.getFullYear()
    const selectedMonth = month ? Number(month) : currentDate.getMonth()

    return {
        start: localDateToUTCString(new Date(selectedYear, selectedMonth, 1)),
        end: localDateToUTCString(new Date(selectedYear, selectedMonth + 1, 0)),
    }
}

const lower = (value: string) => value.trim().toLocaleLowerCase()

export const getSearchItems = (array: any[], value: string) => {
    const arrayFormat = array.map((item) => {
        return {
            ...item,
            res: `${item?.usuario?.nombre} ${item?.usuario?.apellido_paterno}`,
        }
    })

    const getFilterList = (key: string) =>
        arrayFormat.filter((item) => {
            const localText = `${item?.[key]}`.slice(0, value.length)
            return lower(localText).includes(lower(value))
        })

    const productsByName = getFilterList("comentarios")
    const productsByUser = getFilterList("res")

    return [
        ...new Map(
            [...productsByName, ...productsByUser].map((obj) => [`${obj.gasto_id}:${obj.gasto_id}`, obj])
        ).values(),
    ]
}
