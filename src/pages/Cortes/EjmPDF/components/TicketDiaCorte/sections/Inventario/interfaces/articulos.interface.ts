export interface Articulos {
    categoria: string;
    articulos: Articulo[];
}

export interface Articulo {
    nombre:           string;
    stock:            number;
}