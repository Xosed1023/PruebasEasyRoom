export type Turno = {
    turno_atencion_id: string
    folio_turno: string
}

export type ModalProps = {
    onClose: () => void
    onConfirm: () => void
    onLoader: (v: boolean) => void
}
