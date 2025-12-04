import {
    VITE_APP_BUCKET_REGION,
    VITE_APP_SPACES_ENDPOINT,
    VITE_APP_ACCESS_KEY,
    VITE_APP_SECRET_KEY,
} from "@/config/environment"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

type UploadFileParams = {
    bucket: string
    folder: string
    resourceName: string
    file: File
}

export const uploadFileToBucket = async ({ bucket, folder, resourceName, file }: UploadFileParams): Promise<string> => {
    const endpoint = VITE_APP_SPACES_ENDPOINT!
    const region = VITE_APP_BUCKET_REGION
    const accessKeyId = VITE_APP_ACCESS_KEY
    const secretAccessKey = VITE_APP_SECRET_KEY

    const client = new S3Client({
        region,
        endpoint: `https://${endpoint}`,
        credentials: { accessKeyId, secretAccessKey },
    })

    client.middlewareStack.remove?.("flexibleChecksumsMiddleware")

    const cleanFolder = folder.replace(/^\/+|\/+$/g, "")
    const Key = `${cleanFolder}/${resourceName}`.replace(/\/{2,}/g, "/")
    const bodyBytes = new Uint8Array(await file.arrayBuffer())

    await client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key,
            Body: bodyBytes,
            ContentType: file.type || "application/octet-stream",
            ACL: "public-read",
        })
    )

    return `https://${bucket}.${endpoint}/${Key}`
}
