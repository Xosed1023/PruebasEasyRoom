import { REACT_APP_ARTICULOS_BUCKET } from "src/config/environment"
import { uploadFileToBucket } from "src/utils/s3Client"
import { FormValuesParam } from "../Form.types"

export const uploadImage = async (product: FormValuesParam) => {
    if (product.foto) {
        if (typeof product.foto !== "string") {
            const [contenido, unidad] = product.contenido.split("-")
            const resourceName = `${product.nombre}_${contenido}_${unidad}`.toLowerCase()
            const link = await uploadFileToBucket({
                bucket: REACT_APP_ARTICULOS_BUCKET ?? "",
                folder: "productos",
                resourceName,
                file: product.foto,
            })
            return link || null
        } else {
            return product.foto
        }
    } else {
        return null
    }
}
