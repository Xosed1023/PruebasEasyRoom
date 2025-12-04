import DollarSign from "../../../../icons/DollarSign"
import ArrowRightUp from "../../../../icons/ArrowRightUp"
import IconBorder from "../../../../components/core/general/icon-border/IconBorder"
import Card from "../../../home/components/card/Card"
import styles from "./MonthlyExpenseSummary.module.css"

import { Props } from "./MonthlyExpenseSummary.type"
import { formatAmount } from "@/utils/formatAmount"

const MonthlyExpenseSummary = ({ monthLabel, amount, withArrow = false, onClick }: Props) => {
    const formattedAmount = formatAmount(amount, { decimals: true })

  return (
    <Card
      className={styles["monthly-expense-summary"]}
      {...(onClick && { onClick })}
    >
      <div className={styles["monthly-expense-summary__wrapper"]}>
        <IconBorder primaryBgColor="var(--primary)" primaryBgDiameter={50}>
          <DollarSign color="var(--white)" />
        </IconBorder>

        <div className={styles["monthly-expense-summary__labels"]}>
          <span className={styles["monthly-expense-summary__title"]}>
            {monthLabel}
          </span>
          <span className={styles["monthly-expense-summary__subtitle"]}>
            {formattedAmount}
          </span>
        </div>

        {withArrow && (
          <ArrowRightUp className={styles["monthly-expense-summary__icon-corner"]} />
        )}
      </div>
    </Card>
  )
}

export default MonthlyExpenseSummary
