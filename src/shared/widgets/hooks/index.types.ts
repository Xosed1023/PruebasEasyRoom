export type Incidencias = {
    totalAbiertas: number
    abiertas: number
    cerradas: number
    matutino: number
    vespertino: number
    nocturno: number
    altas: number
    medias: number
    bajas: number
}

export type Colaborador = {
    name: string
    image: string
    description: string
    disponible: boolean
}

export type Colaboradores = {
    camaritas: Colaborador[]
    mantenimiento: Colaborador[]
    meseros: Colaborador[]
    otros: Colaborador[]
}

export type PendingPayments = {
    housting: number
    roomService: number
}
