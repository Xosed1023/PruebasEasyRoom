import { formatAmount } from "@/utils/formatAmount"
import styles from "./ExpenseCard.module.css"
import { BillingPerMonthGroupedByCategoryOutput } from "@/gql/schema"

const ExpenseCard = ({ item }: { item: BillingPerMonthGroupedByCategoryOutput }) => (
  <li className={styles["expense-card__item"]}>
    <span className={styles["expense-card__name"]}>{item.categoria.categoria}</span>
    <strong className={styles["expense-card__amount"]}>{formatAmount(item.total_gasto, { decimals: true })}</strong>
  </li>
)

export default ExpenseCard
