import EmptyState from "@/components/core/layout/empty-state/EmptyState"
import CutEmpty from "assets/svg/CutEmpty.svg"

const ExpenseEmpty = () => (
    <EmptyState
      title="Aún no hay gastos"
      description="Esta sección mostrará un historial detallado de los gastos registrados en tu hotel."
      image={<img src={CutEmpty} alt="Sin gastos" />}
    />
)

export default ExpenseEmpty
