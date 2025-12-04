import styles from "./CheckboxIncidence.module.css"

interface Props {
  selected?: boolean
}

const CheckboxIncidence = ({ selected = false }: Props) => {
  return (
    <div
      className={`${styles["checkbox-incidence"]} ${
        selected ? styles["checkbox-incidence--selected"] : ""
      }`}
    />
  )
}

export default CheckboxIncidence
