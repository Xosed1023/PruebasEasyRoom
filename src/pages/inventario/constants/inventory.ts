import { EstadosAlmacenesArticulos, EstadosArticulo } from "src/gql/schema"

export const inventoryDataList = [
    {
        folio: 1,
        nombre: "Sabritas originales",
        marca: "Sabritas",
        categoria: "Alimento",
        contenido: "40 g",
        fecha: "21/04/25",
        costo: "$5",
        precio: "$15",
        cantidad: 15,
        disponibilidad: "Disponible",
    },
    {
        folio: 2,
        nombre: "Sabritas jalapeño",
        marca: "Sabritas",
        categoria: "Alimento",
        contenido: "40 g",
        fecha: "21/04/25",
        costo: "$5",
        precio: "$15",
        cantidad: 15,
        disponibilidad: "Disponible",
    },
    {
        folio: 3,
        nombre: "Sabritas Flaming Hot",
        marca: "Sabritas",
        categoria: "Alimento",
        contenido: "40 g",
        fecha: "21/04/25",
        costo: "$5",
        precio: "$15",
        cantidad: 15,
        disponibilidad: "Disponible",
    },
    {
        folio: 4,
        nombre: "Coca-cola regular",
        marca: "Coca-Cola",
        categoria: "Bebida",
        contenido: "355 ml",
        fecha: "21/04/25",
        costo: "$5",
        precio: "$20",
        cantidad: 0,
        disponibilidad: "Agotado",
    },
    {
        folio: 5,
        nombre: "Coca-cola dieta",
        marca: "Coca-Cola",
        categoria: "Bebida",
        contenido: "355 ml",
        fecha: "21/04/25",
        costo: "$5",
        precio: "$20",
        cantidad: 0,
        disponibilidad: "Agotado",
    },
    {
        folio: 6,
        nombre: "Coca-cola zero",
        marca: "Coca-Cola",
        categoria: "Bebida",
        contenido: "355 ml",
        fecha: "21/04/25",
        costo: "$5",
        precio: "$20",
        cantidad: 0,
        disponibilidad: "Agotado",
    },
    {
        folio: 7,
        nombre: "Fanta",
        marca: "Coca-Cola",
        categoria: "Bebida",
        contenido: "355 ml",
        fecha: "21/04/25",
        costo: "$5",
        precio: "$20",
        cantidad: 20,
        disponibilidad: "Por agotarse",
    },
    {
        folio: 8,
        nombre: "Manzanita",
        marca: "Coca-Cola",
        categoria: "Bebida",
        contenido: "355 ml",
        fecha: "21/04/25",
        costo: "$5",
        precio: "$20",
        cantidad: 20,
        disponibilidad: "Por agotarse",
    },
    {
        folio: 9,
        nombre: "Sprite regular",
        marca: "Coca-Cola",
        categoria: "Bebida",
        contenido: "355 ml",
        fecha: "21/04/25",
        costo: "$5",
        precio: "$20",
        cantidad: 20,
        disponibilidad: "Por agotarse",
    },
    {
        folio: 10,
        nombre: "Jabón",
        marca: "Rosa Venus",
        categoria: "Insumo",
        contenido: "150 g",
        fecha: "21/04/25",
        costo: "$5",
        precio: "N/A",
        cantidad: 10,
        disponibilidad: "Desactivado",
    },
]

export const tableItems = {
    headers: [
        {
            value: "#",
        },
        {
            value: "Nombre del artículo",
        },
        {
            value: "Marca",
        },
        {
            value: "Categoría",
        },
        {
            value: "Contenido neto",
        },
        {
            value: "Último surtido",
        },
        {
            value: "Costo por unidad",
        },
        {
            value: "Precio",
        },
        {
            value: "Cantidad",
        },
        {
            value: "Disponibilidad",
        },
    ],
}

export const assortmentDataList = [
    {
        folio: 1,
        fecha: "15/03/2024",
        cantidad: 15,
        costo_unidad: "$5",
        costo_surtido: "$100",
        responsable: "Blanca Fabiola Fernandez Gómez",
    },
    {
        folio: 2,
        fecha: "15/03/2024",
        cantidad: 15,
        costo_unidad: "$5",
        costo_surtido: "$100",
        responsable: "Blanca Fabiola Fernandez Gómez",
    },
    {
        folio: 3,
        fecha: "15/03/2024",
        cantidad: 15,
        costo_unidad: "$5",
        costo_surtido: "$100",
        responsable: "Blanca Fabiola Fernandez Gómez",
    },
    {
        folio: 4,
        fecha: "15/03/2024",
        cantidad: 15,
        costo_unidad: "$5",
        costo_surtido: "$100",
        responsable: "Blanca Fabiola Fernandez Gómez",
    },
    {
        folio: 5,
        fecha: "15/03/2024",
        cantidad: 15,
        costo_unidad: "$5",
        costo_surtido: "$100",
        responsable: "Blanca Fabiola Fernandez Gómez",
    },
    {
        folio: 6,
        fecha: "15/03/2024",
        cantidad: 15,
        costo_unidad: "$5",
        costo_surtido: "$100",
        responsable: "Blanca Fabiola Fernandez Gómez",
    },
    {
        folio: 7,
        fecha: "15/03/2024",
        cantidad: 15,
        costo_unidad: "$5",
        costo_surtido: "$100",
        responsable: "Blanca Fabiola Fernandez Gómez",
    },
    {
        folio: 8,
        fecha: "15/03/2024",
        cantidad: 15,
        costo_unidad: "$5",
        costo_surtido: "$100",
        responsable: "Blanca Fabiola Fernandez Gómez",
    },
    {
        folio: 9,
        fecha: "15/03/2024",
        cantidad: 15,
        costo_unidad: "$5",
        costo_surtido: "$100",
        responsable: "Blanca Fabiola Fernandez Gómez",
    },
    {
        folio: 10,
        fecha: "15/03/2024",
        cantidad: 15,
        costo_unidad: "$5",
        costo_surtido: "$100",
        responsable: "Blanca Fabiola Fernandez Gómez",
    },
]

export const availabilityHeader = [
    {
        value: "",
        valueToDisplay: "Todos",
    },
    {
        value: EstadosAlmacenesArticulos.Disponible,
        valueToDisplay: "Disponible",
    },
    {
        value: EstadosAlmacenesArticulos.Agotado,
        valueToDisplay: "Agotado",
    },
    {
        value: EstadosAlmacenesArticulos.PorAgotarse,
        valueToDisplay: "Por agotarse",
    },
    {
        value: EstadosArticulo.Desactivado,
        valueToDisplay: "Desactivado",
    },
]

export const typeHeader = [
    {
        value: "",
        valueToDisplay: "Todos",
    },
    {
        value: "Insumo",
        valueToDisplay: "Insumo",
    },
    {
        value: "Venta",
        valueToDisplay: "Venta",
    },
    {
        value: "Proceso",
        valueToDisplay: "Proceso",
    },
]

export const infoEmpty = [
    {
        icon: "Warehouses",
        title: "Almacenes",
        subtitle:
            'Clasifica y agrupa artículos similares para facilitar la búsqueda y manejo de los artículos. Por ejemplo, puedes tener almacenes como "Alimentos", "Bebidas", o "Material de Limpieza".',
    },
    {
        icon: "TypesArticles",
        title: "Tipos de artículos",
        subtitle:
            "Distingue entre artículos finales destinados a la venta directa y los insumos utilizados en los procesos de tu hotel.",
    },
    {
        icon: "AdminArticle",
        title: "Administración de artículos",
        subtitle:
            "Gestiona tus inventarios, evitando desabastecimientos o excesos, y asegurando que los artículos correctos estén disponibles en el lugar y momento adecuados para su venta o uso.",
    },
]

export const infoEmpty2 = [
    {
        icon: "Recipe",
        title: "Recetas",
        subtitle:
            "Crea recetas utilizando los ingredientes de tu inventario para optimizar la preparación y venta a través del servicio de Room Service.",
    },
    {
        icon: "Processes",
        title: "Procesos",
        subtitle:
            "Procesa artículos previos a la receta para usarlos como ingredientes ayudando a simplificar la preparación de platillos.",
    },
    {
        icon: "ControlInputs",
        title: "Control de insumos",
        subtitle:
            "Vincula fácilmente los ingredientes usados en cada receta con el inventario del hotel para gestionar existencias y realizar seguimiento de recursos disponibles.",
    },
]

export const productState = {
    disponible: "Disponible",
    agotado: "Agotado",
    por_agotarse: "Por agotarse",
    desactivado: "Desactivado",
    eliminado: "Eliminado",
}

export const headers = [
    {
        value: "#",
    },
    {
        value: "Nombre del artículo",
        sort: true,
    },
    {
        value: "Marca",
    },
    {
        value: "Tipo",
        filterMenu: typeHeader,
        isFilterUnique: true,
    },
    {
        value: "Cantidad",
    },
    {
        value: "Unidad",
    },
    {
        value: "Último surtido",
    },
    {
        value: "Disponibilidad",
        filterMenu: availabilityHeader,
        isFilterUnique: true,
    },
]

export const TypeArticleDeactivate = {
    venta: {
        title: "¿Deseas desactivar este producto?",
        firstText: "Al desactivar este producto, ",
        boldText: "no se mostrará en room service, ",
        secondText: "seguirá visible en tu inventario se tomará en cuenta para el costo y valor comercial.",
    },
    insumo: {
        title: "¿Deseas desactivar este insumo?",
        firstText: "Al desactivar el insumo, ",
        boldText: "las recetas y procesos relacionados también quedarán desactivados. ",
        secondText: "La desactivación no afectará el costo y valor comercial de tu inventario.",
    },
    proceso: {
        title: "¿Deseas desactivar esta producción?",
        firstText: "Al desactivar esta producción, ",
        boldText: "las recetas relacionadas también quedarán desactivados. ",
        secondText: "La desactivación no afectará el costo y valor comercial de tu inventario. ",
    },
    receta: {
        title: "¿Deseas desactivar esta receta?",
        firstText: "Al desactivar está receta, ",
        boldText: "no podrás producirla, agregarla como ingredientes y no aparecerá en el módulo de room service, ",
        secondText: "pero seguirá visible en tu inventario y se tomará en cuenta para el costo y valor comercial.",
    },
}

export const TypeArticleActivate = {
    venta: {
        title: "¿Deseas activar este producto?",
        firstText: "Al activar, el producto ",
        boldText: "estará disponible para resurtir el inventario y para su venta ",
        secondText: "en servicio a la habitación.",
    },
    insumo: {
        title: "¿Deseas activar este artículo?",
        firstText: "Al activar, el artículo ",
        boldText: "estará disponible para resurtir el inventario y para su venta ",
        secondText: "en servicio a la habitación.",
    },
    proceso: {
        title: "¿Deseas activar esta producción?",
        firstText: "Al activar esta producción, ",
        boldText: "las recetas relacionadas también se activarán.",
        secondText: "",
    },
    receta: {
        title: "¿Deseas activar esta receta?",
        firstText: "Al activar, la receta ",
        boldText: "estará disponible para producir, ver en ingredientes y para su venta ",
        secondText: "en room service.",
    },
}

export const TypeArticleDeleteUnique = {
    venta: {
        firstText: "Al eliminarlo, este ",
        boldText: "producto se borrará del inventario y no aparecerá más en la lista de productos",
        secondText: "para la venta o como insumo en tu hotel. Si decides incluirlo nuevamente en el inventario, será necesario registrarlo.",
    },
    insumo: {
        firstText: "Al eliminarlo, ",
        boldText: "este insumo dejará de estar disponible en este almacén. ",
        secondText: "Si decides incluirlo nuevamente en el inventario, será necesario registrarlo.",
    },
    proceso: {
        firstText: "Al eliminarlo, este ",
        boldText: "artículo se borrará del inventario y no aparecerá más en la lista de artículos ",
        secondText: "para la venta o como insumo en tu hotel. Si decides incluirlo nuevamente en el inventario, será necesario registrarlo",
    }
}
