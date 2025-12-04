export type FormHuespedValues = {
  fecha: Date | null
  turno: string
  tipo: string
  matricula:string,
  responsable: string
  descripcion: string
  evidencias?: string[]               
  evidenceFiles?: (File | null)[]    
  tipo_incidencia: "instalaciones" | "habitación" | "huésped"
}

export type FormHuespedProps = {
  onSubmit: (formData: FormHuespedValues) => void
  loading?: boolean
  error?: unknown
}
