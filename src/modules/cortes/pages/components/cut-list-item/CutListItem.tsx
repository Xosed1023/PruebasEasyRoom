import Download from "@/icons/Download"
import { formatAmount } from "@/utils/formatAmount"
import { EyeIcon } from "lucide-react"
import { CutListItemProps } from "./CutListItem.type"

import styles from "./CutListITem.module.css"
import IconLoader from "@/icons/IconLoader"
import { useEffect, useState } from "react"

const CutListItem = ({ onDetails, onDownload, title, value, loading, setIsLoading }: CutListItemProps) => {
    const [isLoading, setisLoading] = useState<boolean>(false)

    useEffect(() => {
        if(!loading) {
            setisLoading(false)
        }
    }, [loading])
    

    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-col">
                <span className={styles["cut__list__item__title"]}>{title}</span>
                <span className={styles["cut__list__item__value"]}>{formatAmount(value, { decimals: true })}</span>
            </div>
            <div className="flex gap-x-[24px] overflow-hidden">
                <EyeIcon color="var(--primary)" width={20} height={20} onClick={onDetails} />
                {isLoading && loading ? (
                    <IconLoader color="var(--primary)" width={20} height={20} />
                ) : (
                    <Download
                        color="var(--primary)"
                        width={20}
                        height={20}
                        onClick={() => {
                            onDownload()
                            setisLoading(true)
                            setIsLoading(true)
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default CutListItem
