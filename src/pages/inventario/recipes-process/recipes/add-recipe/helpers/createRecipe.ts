import { DefaultValues } from "../interfaces/defaultValues"
import { uploadFileToBucket } from "src/utils/s3Client"
import { v4 as uuid } from "uuid"
import { REACT_APP_ARTICULOS_BUCKET, REACT_APP_AVATARS_BUCKET_FOLDER } from "src/config/environment"
import {
    CategoriasArticulosNuevaRecetaProcesoQuery,
    EstadosArticulo,
    TipoArticulo,
    UnidadMedidasArticulo,
} from "src/gql/schema"
import { RenderSnackbarProps } from "src/shared/hooks/useSnackbar"
import { NavigateFunction } from "react-router-dom"
import { sum } from "src/shared/helpers/calculator"

const createRecipe = async ({
    data,
    showSnackbar,
    crearReceta,
    usuario_id,
    categorias_articulos,
    navigate,
    hotel_id
}: {
    data: DefaultValues
    showSnackbar: (v: RenderSnackbarProps) => void
    crearReceta: any
    usuario_id: string
    categorias_articulos: CategoriasArticulosNuevaRecetaProcesoQuery | undefined
    navigate: NavigateFunction
    hotel_id: string
}) => {
    let avatarUrl: string | undefined = undefined

    if (data.photo) {
        avatarUrl = await uploadFileToBucket({
            bucket: REACT_APP_ARTICULOS_BUCKET ?? "",
            folder: REACT_APP_AVATARS_BUCKET_FOLDER ?? "",
            resourceName: uuid(),
            file: data.photo as File,
        })
    }
    return await crearReceta({
        variables: {
            createRecetaInput: {
                foto: avatarUrl,
                marca: "N/A",
                tipo: TipoArticulo.Receta,
                estado: EstadosArticulo.Activado,
                extra: data.isExtra,
                costo_actual: sum(data.articles.map((i) => i.total)),
                usuario_id: usuario_id,
                nombre: data.recipeName,
                categoria_id: data.category,
                unidad: data.measurement as UnidadMedidasArticulo,
                precio: data.publicPrice,
                contenido: 1,
                hotel_id,
                ingredientes: data.articles.map((i) => ({
                    almacen_articulo_id: i.name?.id || "",
                    cantidad: Number(i.measurement?.value || 0),
                    unidad: i.measurement?.type || UnidadMedidasArticulo.Pz,
                })),
            },
        },
    })
        .then(() => {
            showSnackbar({
                status: "success",
                title: data.isExtra ? "Extra agregado" : "Receta agregada",
                text: `Se agregó **${data.recipeName}** a **${
                    categorias_articulos?.categorias_articulos.find((c) => c.categoria_id === data.category)?.nombre
                }** exitosamente`,
            })
        })
        .catch((e) => {
            if (e.message === "Ya existe un articulo activo con el mismo nombre") {
                return showSnackbar({
                    title: "Receta registrada",
                    text: `La receta **${data.recipeName}** ya se encuentra registrada en el inventario`,
                    status: "error",
                })
            }
            showSnackbar({
                status: "error",
                title: "Error al crear receta",
            })
        })
        .finally(() => {
            navigate("/u/inventario/receta-proceso", { replace: true })
        })
}

export default createRecipe
