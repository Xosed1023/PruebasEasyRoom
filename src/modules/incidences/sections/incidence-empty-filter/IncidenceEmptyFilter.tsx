import EmptyState from "@/components/core/layout/empty-state/EmptyState";
import emptyImage from "@/assets/png/NoSearchResult.png";
import styles from "./IncidenceEmptyFilter.module.css";
import { Props } from "./IncidenceEmptyFilter.type";

const IncidenceEmptyFilter = ({ onClear }: Props) => {
  return (
    <div className={styles.emptyFilterPage}>
      <EmptyState
        title="Sin coincidencias con los filtros"
        description="No hay resultados que coincidan con los filtros seleccionados."
        secondaryDescription="¿Quieres probar con menos filtros?"
        image={
          <img
            src={emptyImage}
            alt="Sin coincidencias"
            className={styles.image}
          />
        }
        button={{
          title: "Limpiar filtros",
          onClick: onClear,
        }}
      />
    </div>
  );
};

export default IncidenceEmptyFilter;
