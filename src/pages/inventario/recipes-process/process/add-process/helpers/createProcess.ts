import { uploadFileToBucket } from "src/utils/s3Client"
import { v4 as uuid } from "uuid"
import { REACT_APP_ARTICULOS_BUCKET, REACT_APP_AVATARS_BUCKET_FOLDER } from "src/config/environment"
import { EstadosArticulo, TipoArticulo, UnidadMedidasArticulo } from "src/gql/schema"
import { RenderSnackbarProps } from "src/shared/hooks/useSnackbar"
import { NavigateFunction } from "react-router-dom"
import { DefaultValues } from "../interfaces/defaultValues"
import { sum } from "src/shared/helpers/calculator"

const createProcess = async ({
    data,
    showSnackbar,
    crearProceso,
    usuario_id,
    navigate,
    hotel_id
}: {
    data: DefaultValues
    showSnackbar: (v: RenderSnackbarProps) => void
    crearProceso: any
    usuario_id: string
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
    crearProceso({
        variables: {
            createRecetaInput: {
                costo_actual: sum(data.articles.map((i) => i.total)),
                foto: avatarUrl,
                marca: "N/A",
                tipo: TipoArticulo.Proceso,
                estado: EstadosArticulo.Activado,
                usuario_id: usuario_id,
                nombre: data.processName,
                extra: false,
                hotel_id,
                unidad: data.measurement as UnidadMedidasArticulo,
                contenido: Number(data.quantity),
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
                title: "Proceso agregado",
                text: `Se agregó **${data.processName}** a **Procesos** exitosamente`,
            })
        })
        .catch((e) => {
            if (e.message === "Ya existe un artículo activo con el mismo nombre") {
                return showSnackbar({
                    title: "Proceso registrado",
                    text: `El proceso **${data.processName}** ya se encuentra registrado en el inventario`,
                    status: "error",
                })
            }
            showSnackbar({
                status: "error",
                title: "Error al crear proceso",
            })
        })
        .finally(() => {
            navigate("/u/inventario/receta-proceso", { replace: true })
        })
}

export default createProcess
