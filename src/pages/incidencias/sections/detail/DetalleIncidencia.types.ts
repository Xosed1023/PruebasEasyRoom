export type FormValues = {
    name: string
    comment: string
}
export interface ItemsIncidencia {
    icon: string
    label: string
    value: string
}

export interface DataCloseIncidence {
    colaborador_id_cierra: string
    comentario_cierre: string
    incidencia_id: string
}

export type DetalleIncidenciaProps = {
  incidenciaId: string
  onConfirm?: () => void
  onTipoIncidenciaChange?: (tipo: string) => void
}