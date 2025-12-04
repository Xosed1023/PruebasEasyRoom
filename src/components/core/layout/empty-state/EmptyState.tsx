import { ReactNode } from "react"
import styles from "./EmptyState.module.css"

type EmptyStateButton = {
  title: string
  onClick: () => void
}

const EmptyState = ({
  title,
  description,
  secondaryDescription, 
  image,
  button,
}: {
  title: string
  description: string
  secondaryDescription?: string | ReactNode
  image: ReactNode
  button?: EmptyStateButton
}) => {
  return (
    <div className="flex flex-col items-center flex-1 justify-center">
      {image}
      <span className={styles["empty-state__title"]}>{title}</span>
      <span className={styles["empty-state__description"]}>{description}</span>
      {secondaryDescription && (
        <span className={styles["empty-state__description"]}>
          {secondaryDescription}
        </span>
      )}

      {button && (
        <button
          className={`s:mt-[40px] xs:mt-[30px] ${styles["empty-state__button"]}`}
          onClick={button.onClick}
        >
          {button.title}
        </button>
      )}
    </div>
  )
}

export default EmptyState

