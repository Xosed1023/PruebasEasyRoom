export type FormHabitacionesValues = {
  fecha: Date | null
  turno: string
  tipo: string
  habitacion_id: string
  responsable: string
  descripcion: string
  tipo_incidencia: "instalaciones" | "habitación" | "huésped"
  evidencias: string[]           
  evidenceFiles?: (File | null)[]  
}

export type FormHabitacionesProps = {
  onSubmit: (formData: FormHabitacionesValues) => void
  loading?: boolean
  error?: unknown
}
