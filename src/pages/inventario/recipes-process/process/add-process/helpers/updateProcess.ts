import { Receta, UnidadMedidasArticulo } from "src/gql/schema"
import { DefaultValues } from "../interfaces/defaultValues"
import { uploadFileToBucket } from "src/utils/s3Client"
import { REACT_APP_ARTICULOS_BUCKET, REACT_APP_AVATARS_BUCKET_FOLDER } from "src/config/environment"
import { v4 as uuid } from "uuid"
import { RenderSnackbarProps } from "src/shared/hooks/useMiniSnackbar"
import { NavigateFunction } from "react-router-dom"
import { sum } from "src/shared/helpers/calculator"

const updateProcess = async ({
    actualizarProceso,
    dirtyFields,
    data,
    showMiniSnackbar,
    articulo_id,
    navigate,
    receta
}: {
    actualizarProceso: any
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
            file: data.photo as unknown as File,
        })
    }
    return actualizarProceso({
        variables: {
            updateRecetaInput: {
                costo_actual: sum(data.articles.map((i) => i.total)),
                articulo_id: articulo_id || "",
                ...((dirtyFields.measurement && receta?.articulo?.unidad !== data.measurement) ? { unidad: data.measurement as UnidadMedidasArticulo } : {}),
                ...((dirtyFields.processName && receta?.articulo?.nombre !== data.processName) ? { nombre: data.processName } : {}),
                ...((dirtyFields.quantity && receta?.articulo?.contenido !== data.quantity) ? { contenido: Number(data.quantity) } : {}),
                ...((dirtyFields.photo && data.photo) ? { foto: avatarUrl } : {}),
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
            if (e.message === "Ya existe un artículo activo con el mismo nombre") {
                return showMiniSnackbar({
                    title: "Proceso registrado",
                    text: `El proceso **${data.processName}** ya se encuentra registrado en el inventario`,
                    status: "error",
                })
            }
            showMiniSnackbar({
                status: "error",
                title: "Error al actualizar proceso",
            })
        })
}

export default updateProcess
