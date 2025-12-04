import ExpenseCard from "../../components/expense-card/ExpenseCard"
import MonthlyExpenseSummary from "../../components/monthly-expense-summary/MonthlyExpenseSummary.tsx"
import styles from "./ExpenseList.module.css"
import { MONTH_NAMES } from "../../../../utils/month-names.ts"
import { BillingPerMonthGroupedByCategoryOutput } from "@/gql/schema.tsx"
  
const ExpenseList = ({
    items = [],
    totalAmount,
    selectedMonths,
  }: {
    items: BillingPerMonthGroupedByCategoryOutput[]
    totalAmount: number
    selectedMonths: number[]
  }) => {
  
    const monthLabel =
      selectedMonths.length === 1
        ? MONTH_NAMES[selectedMonths[0]]
        : "Total"
  
    return (
      <div className={styles["expense-list__container"]}>
        <MonthlyExpenseSummary
          monthLabel={monthLabel}
          amount={totalAmount}
          onClick={() => {}}
        />
  
        <ul className={styles["expense-list__items"]}>
          {items?.map((item) => (
            <ExpenseCard key={item.categoria.categoria} item={item} />
          ))}
        </ul>
      </div>
    )
  }
  
  

export default ExpenseList
