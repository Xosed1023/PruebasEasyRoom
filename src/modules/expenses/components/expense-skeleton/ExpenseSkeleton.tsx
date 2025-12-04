import { Skeleton } from "@/components/ui/Skeleton/Skeleton"
import styles from "./ExpenseSkeleton.module.css"

const ExpenseSkeleton = () => {
    return (
        <div className={styles["expense-skeleton__container"]}>
            <div className={styles["expense-skeleton__card"]}>
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className={styles["expense-skeleton__text-wrapper"]}>
                    <Skeleton className="h-4 w-[60%]" />
                    <Skeleton className="h-4 w-[90%]" />
                </div>
            </div>

            <div className={styles["expense-skeleton__list"]}>
                {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-[95%] rounded-md" />
                ))}
            </div>
        </div>
    )
}

export default ExpenseSkeleton
