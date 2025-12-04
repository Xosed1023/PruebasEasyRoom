import styles from "./TotalIncome.module.css"
import IconBorder from "@/components/core/general/icon-border/IconBorder"
import DollarSign from "@/icons/DollarSign"
import Card from "../card/Card"
import ArrowRightUp from "@/icons/ArrowRightUp"
import { useNavigate } from "react-router"
import { useCurrentDateQuery } from "@/gql/schema"
import { formatCurrency } from "@/helpers/format-currency"
import { dateHelpers } from "@/helpers/dateHelpers"
import { useTotals } from "../../pages/total-daily-income/hooks/useTotals"
import TotalIncomeSkeleton from "./TotalIncomeSkeleton"

const TotalIncome = ({hotel_id}: {hotel_id: string}) => {
    const navigate = useNavigate()
    const { UTCStringToLocalDate } = dateHelpers()
    const { data } = useCurrentDateQuery()
    const { stats, loading } = useTotals({ hotel_id, date: UTCStringToLocalDate(data?.serverDate) })
    
if (loading) return <TotalIncomeSkeleton />
    return (
        <Card className={styles["total-income"]} onClick={() => navigate("daily-income")}>
            <div className={styles["total-income__wrapper"]}>
                <IconBorder primaryBgColor="var(--primary)" primaryBgDiameter={50}>
                    <DollarSign color="var(--white)" />
                </IconBorder>
                <div className={styles["total-income__labels"]}>
                    <span className={styles["total-income__title"]}>Ingreso total del día</span>
                    <span className={styles["total-income__subtitle"]}>{formatCurrency(stats.total)}</span>
                </div>
                <ArrowRightUp className={styles["total-income__icon__corner"]} />
            </div>
        </Card>
    )
}

export default TotalIncome
