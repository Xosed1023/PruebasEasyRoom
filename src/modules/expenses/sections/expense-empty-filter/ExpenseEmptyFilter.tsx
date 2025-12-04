import EmptyState from "@/components/core/layout/empty-state/EmptyState"
import NoSearchResult from "assets/png/NoSearchResult.png"

const ExpenseEmptyFiltered = ({ onClear }: { onClear: () => void }) => {
  return (
      <EmptyState
        title="Sin gastos"
        description="En este mes no se han registrado gastos."
        image={
          <img
            src={NoSearchResult}
            alt="Sin resultados"
          />
        }
        button={{
          title: "Limpiar filtros",
          onClick: onClear,
        }}
      />
  )
}

export default ExpenseEmptyFiltered
