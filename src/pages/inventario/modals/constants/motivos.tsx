import { Motivo } from "src/gql/schema";
import { Option } from "src/shared/components/forms/selelct-dropdown/Dropdown";

/**
 * Motivos de un producto para su salida o transferencia entre almacentes
 * */ 
export const MOTIVOS_PRODUCTO: Option[] = [
    {
        label: "Producto caducado",
        value: Motivo.Caducado
    },
    {
        label: "Producto faltante",
        value: Motivo.Faltante
    },
    {
        label: "Merma",
        value: Motivo.Merma
    },
]

/**
 * Motivos de un insumo para su salida o transferencia entre almacentes
 * */ 
export const MOTIVOS_INSUMO: Option[] = [
    {
        label: "Insumo usado",
        value: Motivo.ConsumoInterno
    },
    {
        label: "Producto caducado",
        value: Motivo.Caducado
    },
    {
        label: "Producto faltante",
        value: Motivo.Faltante
    },
    {
        label: "Merma",
        value: Motivo.Merma
    },
]