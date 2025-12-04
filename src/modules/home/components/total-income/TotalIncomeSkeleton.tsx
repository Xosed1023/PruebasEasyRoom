import { Skeleton } from "@/components/ui/Skeleton/Skeleton"
import styles from "./TotalIncome.module.css"
import IconBorder from "@/components/core/general/icon-border/IconBorder"
import DollarSign from "@/icons/DollarSign"
import ArrowRightUp from "@/icons/ArrowRightUp"
import Card from "../card/Card"

const TotalIncomeSkeleton = () => {
    return (
        <Card className={styles["total-income"]}>
            <div className={styles["total-income__wrapper"]}>
                <IconBorder primaryBgColor="var(--primary)" primaryBgDiameter={50}>
                    <DollarSign color="var(--white)" />
                </IconBorder>

                <div className={styles["total-income__labels"]}>
                    <span className={styles["total-income__title"]}>Ingreso total del día</span>

                    <Skeleton  className={`${styles["total-income__skeleton"]} h-[18px] w-[185px] mt-[7px]`} />
                </div>

                <ArrowRightUp className={styles["total-income__icon__corner"]} />
            </div>
        </Card>
    )
}

export default TotalIncomeSkeleton
