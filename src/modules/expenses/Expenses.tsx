import Header from "@/components/core/layout/header/Header"
import Screen from "@/components/core/layout/screen/Screen"
import NavbarNavigator from "@/components/core/navigation/navbar"
import { BillingPerMonthGroupedByCategoryOutput, useGetGastosCategorasPorMesQuery } from "@/gql/schema"
import Icon from "@/icons"
import { useEffect, useState } from "react"
import ExpenseSkeleton from "./components/expense-skeleton/ExpenseSkeleton"
import { MonthFilterSheet } from "./components/month-filter/MonthFilter"
import styles from "./Expenses.module.css"
import ExpenseEmptyFilter from "./sections/expense-empty-filter/ExpenseEmptyFilter"
import ExpenseEmpty from "./sections/expense-empty/ExpenseEmpty"
import ExpenseList from "./sections/expense-list/ExpenseList"
import { MONTH_NAMES } from "../../utils/month-names"
import { useProfile } from "@/hooks/store/useProfile"
import SectionTitle from "@/components/core/layout/section-title/SectionTitle"
import { sum } from "@/helpers/calculator"
import { Button } from "@/components/ui/Button/Button"

const Expenses = () => {
    const [showFilter, setShowFilter] = useState(false)
    const [selectedMonths, setSelectedMonths] = useState<number[]>([new Date().getMonth()])
    const [hasFiltered, setHasFiltered] = useState(false)
    const { hotel_id } = useProfile()
    const monthsToUse = selectedMonths.length === 0 ? [new Date().getMonth()] : selectedMonths
    const { data, refetch, loading } = useGetGastosCategorasPorMesQuery({
        variables: {
            hotel_id,
            gastosCategoria: (monthsToUse[0] + 1).toString(),
        },
    })

    useEffect(() => {
        if (!hotel_id) return
        refetch({
            hotel_id,
            gastosCategoria: selectedMonths.map((m) => (m + 1).toString()),
        })
    }, [hotel_id, selectedMonths])

    const handleOpenFilter = () => {
        if (selectedMonths.length === 0) {
            const currentMonth = new Date().getMonth()
            setSelectedMonths([currentMonth])
        }
        setShowFilter(true)
    }

    const handleRemoveMonth = (month: number) => {
        // prevenir seleccion nula de mes
        if (selectedMonths.length <= 1) {
            setHasFiltered(false)
            const currentMonth = new Date().getMonth()
            setSelectedMonths([currentMonth])
            return
        }
        setSelectedMonths((prev) => prev.filter((m) => m !== month))
    }

    const handleCloseFilter = () => setShowFilter(false)
    const handleMonthChange = (months: number[]) => {
        // prevenir seleccion nula de mes
        if (!months?.length) {
            setHasFiltered(false)
            const currentMonth = new Date().getMonth()
            setSelectedMonths([currentMonth])
            return
        }
        setSelectedMonths(months)
        setHasFiltered(true)
    }

    const gastos = data?.gastos_categoria_por_meses
        ?.flatMap((v) => v.gastos_por_categoria)
        .sort((a, b) => b.total_gasto - a.total_gasto) as BillingPerMonthGroupedByCategoryOutput[]

    const totalAmount = sum(gastos?.map((g) => g.total_gasto) || [])

    return (
        <Screen className="gap-y-[20px] flex flex-col" header={<Header />} footer={<NavbarNavigator />}>
            <div className="pt-[24px] flex flex-col gap-4">
                {gastos?.length > 0 && (
                    <div className="flex justify-between items-center">
                        <SectionTitle title="Gastos totales" semiBold />
                        <Button size="icon" variant="ghost" aria-label="Filtrar" onClick={handleOpenFilter}>
                            <Icon name="FilterFunnel" width={20} height={20} color="#5E3EDA" />
                        </Button>
                    </div>
                )}

                {hasFiltered && selectedMonths.length > 0 && (
                    <div className={styles["expenses__filters"]}>
                        {selectedMonths.map((month) => (
                            <span key={month} className={styles["expenses__filter-tag"]}>
                                {MONTH_NAMES[month]}

                                <Icon
                                    name="Close"
                                    height={14}
                                    width={14}
                                    color=" #9E77ED"
                                    className={styles["expenses__filter-tag-close"]}
                                    onClick={() => handleRemoveMonth(month)}
                                />
                            </span>
                        ))}
                    </div>
                )}
                {loading ? (
                    <ExpenseSkeleton />
                ) : gastos?.length === 0 ? (
                    hasFiltered && selectedMonths.length > 0 ? (
                        <ExpenseEmptyFilter
                            onClear={() => {
                                setSelectedMonths([new Date().getMonth()])
                                setHasFiltered(false)
                            }}
                        />
                    ) : (
                        <ExpenseEmpty />
                    )
                ) : (
                    <ExpenseList items={gastos} totalAmount={totalAmount} selectedMonths={monthsToUse} />
                )}
            </div>

            {showFilter && (
                <MonthFilterSheet
                    selectedMonths={selectedMonths}
                    onChange={handleMonthChange}
                    onClose={handleCloseFilter}
                    multiSelect={true}
                />
            )}
        </Screen>
    )
}

export default Expenses
