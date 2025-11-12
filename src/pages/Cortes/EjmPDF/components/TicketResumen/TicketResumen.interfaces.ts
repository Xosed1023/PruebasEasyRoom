export interface ResumenIngresos {
    ingresos :{ 
        concepto?: string; 
        cantidad?: number; 
        precio_promedio?: number | string; 
        total?: number 
    }[],
    total: number
}

export interface ManejoEfectivo {
    concepto?: string,
    cantidad?: number,
    monto?: number,
    total?: number
}

export interface ResumenGastos {
    gastos?: {
        concepto?: string,
        total?: number
    }[]
    total?: number
}

export interface Subtotales {
    subtotales?: {
        concepto?: string,
        total?: number
    }[]
    total?: number
}