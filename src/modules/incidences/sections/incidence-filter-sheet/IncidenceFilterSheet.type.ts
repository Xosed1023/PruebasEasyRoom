export type Filters = {
  months: number[]
  origenes: string[]
  turnos: string[]
  urgencias: string[]
}

export type IncidenceFilterSheetProps = {
  selectedFilters: Filters
  onChange: (filters: Filters) => void
  onClose: () => void
  onClearFilters: () => void
  open: boolean
}