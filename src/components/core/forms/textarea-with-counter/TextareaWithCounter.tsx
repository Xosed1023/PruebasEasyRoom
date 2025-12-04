import { useRef } from "react"
import cx from "classnames"
import styles from "./TextareaWithCounter.module.css"

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  className?: string
  label?: string
}

export default function TextareaWithCounter({
  value,
  onChange,
  placeholder = "",
  maxLength = 200,
  className = "",
  label,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className={cx(styles["textarea__container"], className)}>
      {label && <p className={styles["textarea__label"]}>{label}</p>}
      <div className={styles["textarea__box"]} ref={ref}>
        <textarea
          className={styles["textarea__field"]}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className={styles["textarea__counter"]}>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  )
}
