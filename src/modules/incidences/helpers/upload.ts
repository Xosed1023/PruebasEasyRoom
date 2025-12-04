import { base64ToFile } from "@/helpers/files"
import { VITE_APP_ARTICULOS_BUCKET } from "src/config/environment"
import { uploadFileToBucket } from "src/utils/s3Client"

type UploadableImage = {
    file: string | null
    index?: number
}

export const uploadIncidenceImage = async (image: UploadableImage, folder = "incidencias"): Promise<string> => {
    if (!image?.file) throw new Error("Archivo vacío")
    const mimeType = "jpeg"
    const fileName = `photo.${mimeType}`

    const file = base64ToFile(image.file.split(",")?.[1], fileName, mimeType)

    const timestamp = Date.now()
    const resourceName = `evidencia_${timestamp}_${image.index ?? 0}`
    const cleanFolder = folder.replace(/^\/+|\/+$/g, "")

    const bucketName =
        VITE_APP_ARTICULOS_BUCKET ??
        (import.meta.env.VITE_APP_ARTICULOS_BUCKET as string | undefined) ??
        (import.meta.env.VITE_REACT_APP_ARTICULOS_BUCKET as string | undefined) ??
        ""

    try {
        const link = await uploadFileToBucket({
            bucket: bucketName,
            folder: cleanFolder,
            resourceName,
            file,
        })

        if (!link) throw new Error("La subida no devolvió URL.")
        return link
    } catch (err) {
        console.error("uploadIncidenceImage error ->", err)
        throw err
    }
}
