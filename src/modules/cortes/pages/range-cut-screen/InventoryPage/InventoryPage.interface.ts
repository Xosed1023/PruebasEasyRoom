export interface InventarioResponse {
    articulos: InventarioResponseArticulo[];
    tarjetas:  Tarjeta[];
}

export interface InventarioResponseArticulo {
    articulos:    Articulo[];
    categoria_id: string;
    nombre:       string;
}

export interface Articulo {
    articulo: string;
    cantidad: number;
    total:    string;
}

export interface Tarjeta {
    nombre:   string;
    total:    string;
    unidades: number;
}