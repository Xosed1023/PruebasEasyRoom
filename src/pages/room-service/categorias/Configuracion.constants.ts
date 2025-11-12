export const tabs = [
    { label: "Categorías", path: "categorias", number: 0 },
    { label: "Gestión de ventas", path: "gestion", number: 0 },
]
export const text =
    "Permitir la salida y venta productos sin unidades en inventario desde Room Service y registrar inventario negativo."

export const ejemplo =
    "Ej. Tienes un producto agotado en inventario (0 unidades), pero vendes en room service o sacas del inventario 5 unidades, ahora tu inventario muestra -5 unidades."

export type AuthSuccess = {
    state: boolean
    type: "agregar" | "editar" | "eliminar" | ""
}
