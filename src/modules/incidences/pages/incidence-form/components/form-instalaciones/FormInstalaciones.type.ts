export interface FormInstalacionesValues {
  fecha: Date | null
  responsable: string
  turno: string
  descripcion: string
  tipo_incidencia: "instalaciones" | "habitación" | "huésped"
  imagenes?: (File | null)[]
}
export type Props = {
  onSubmit: (formData: any) => void
  loading?: boolean
  error?: any
}