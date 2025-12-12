import { EstadosArticulo, Receta, UnidadMedidasArticulo } from "src/gql/schema"
import { DefaultValues } from "../interfaces/defaultValues"
import { uploadFileToBucket } from "src/utils/s3Client"
import { REACT_APP_ARTICULOS_BUCKET, REACT_APP_AVATARS_BUCKET_FOLDER } from "src/config/environment"
import { v4 as uuid } from "uuid"
import { RenderSnackbarProps } from "src/shared/hooks/useMiniSnackbar"
import { NavigateFunction } from "react-router-dom"
import { sum } from "src/shared/helpers/calculator"

const updateRecipe = async ({
    actualizarReceta,
    dirtyFields,
    data,
    showMiniSnackbar,
    articulo_id,
    navigate,
    receta,
}: {
    actualizarReceta: any
    dirtyFields: any
    data: DefaultValues
    showMiniSnackbar: (v: RenderSnackbarProps) => void
    articulo_id: string
    navigate: NavigateFunction
    receta?: Receta
}) => {
    let avatarUrl: string | undefined = undefined

    if (data.photo && dirtyFields.photo) {
        avatarUrl = await uploadFileToBucket({
            bucket: REACT_APP_ARTICULOS_BUCKET ?? "",
            folder: REACT_APP_AVATARS_BUCKET_FOLDER ?? "",
            resourceName: uuid(),
            file: data.photo as File,
        })
    }

    return actualizarReceta({
        variables: {
            updateRecetaInput: {
                costo_actual: sum(data.articles.map((i) => i.total)),
                articulo_id: articulo_id || "",
                ...(dirtyFields.measurement && receta?.articulo?.unidad !== data.measurement
                    ? { unidad: data.measurement as UnidadMedidasArticulo }
                    : {}),
                ...(dirtyFields.recipeName && receta?.articulo?.nombre !== data.recipeName
                    ? { nombre: data.recipeName }
                    : {}),
                ...(dirtyFields.photo && data.photo ? { foto: avatarUrl } : {}),
                ...(dirtyFields.category && receta?.articulo?.categoria_id !== data.category
                    ? { categoria_id: data.category }
                    : {}),
                ...(dirtyFields.isExtra && receta?.articulo?.extra !== data.isExtra ? { extra: data.isExtra } : {}),
                ...(dirtyFields.isActive && receta?.articulo?.estado !== data.isActive
                    ? { estado: data.isActive ? EstadosArticulo.Activado : EstadosArticulo.Desactivado }
                    : {}),
                ...(dirtyFields.publicPrice && receta?.articulo?.precio?.monto !== data.publicPrice
                    ? { precio: data.publicPrice }
                    : {}),
                ...(dirtyFields.articles
                    ? {
                        ingredientes: data.articles.map((art) => ({
                            almacen_articulo_id: art.name?.id || "",
                            cantidad: Number(art.measurement?.value) || 0,
                            unidad: art.measurement?.type || UnidadMedidasArticulo.Pz,
                        })),
                    }
                    : {}),
            },
        },
    })
        .then(() => {
            showMiniSnackbar({
                status: "success",
                title: "Cambios guardados",
                text: "Se han guardado los cambios exitosamente",
            })
            navigate("/u/inventario/receta-proceso", { replace: true })
        })
        .catch((e) => {
            if (e.message === "Ya existe un articulo activo con el mismo nombre") {
                return showMiniSnackbar({
                    title: "Receta registrada",
                    text: `La receta **${data.recipeName}** ya se encuentra registrada en el inventario`,
                    status: "error",
                })
            }
            showMiniSnackbar({
                status: "error",
                title: "Error al actualizar receta",
            })
        })
}

export default updateRecipe
