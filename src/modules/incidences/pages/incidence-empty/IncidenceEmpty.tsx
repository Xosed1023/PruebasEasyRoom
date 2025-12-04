import EmptyState from "@/components/core/layout/empty-state/EmptyState"
import styles from "./IncidenceEmpty.module.css"
import emptyIncidence from "assets/png/empty-incidence.png"
import { useNavigate, useParams } from "react-router"

const IncidenceEmpty = () => {
  const navigate = useNavigate()
  const { hotel_id } = useParams()

  return (
    <div className={styles.emptyPage}>
      <EmptyState
        title="Todo está tranquilo"
        description="Por ahora no hay incidencias registradas."
        secondaryDescription="¿Notaste algo? Agrégalo aquí."
        image={
          <img
            src={emptyIncidence}
            alt="Empty Incidence"
            className={styles["empty-state__image"]}
          />
        }
        button={{
          title: "Registrar incidencia",
          onClick: () => navigate(`/u/incidences/${hotel_id}/new`),
        }}
      />
    </div>
  )
}

export default IncidenceEmpty
