import { S3Client, PutObjectCommand, PutObjectCommandInput, DeleteObjectCommand,  } from '@aws-sdk/client-s3';
import { REACT_APP_ACCES_KEY, REACT_APP_BUCKET_REGION, REACT_APP_SECRET_KEY, REACT_APP_SPACES_ENDPOINT } from 'src/config/environment';

const s3Client = new S3Client({
    endpoint: `https://${REACT_APP_SPACES_ENDPOINT}`,
    forcePathStyle: false,
    region: REACT_APP_BUCKET_REGION ?? 'us-east-1',
    credentials: {
        accessKeyId: REACT_APP_ACCES_KEY ?? '',
        secretAccessKey: REACT_APP_SECRET_KEY ?? '',
    }
});

export const uploadFileToBucket = async ({ bucket, folder, resourceName, file }:
    { bucket: string, folder: string, resourceName: string, file: File }) => {
    try {
        let url = '';
        if (file) {
            const { name, type } = file;
            const fileExtension = name.split('.').pop();
    
            const params: PutObjectCommandInput = {
                Body: file,
                Bucket: bucket,
                Key: `${folder}/${resourceName}.${fileExtension}`,
                ACL: 'public-read',
                ContentType: type,
            };
    
            const putObject = new PutObjectCommand(params);
    
            await s3Client.send(putObject)
                .then((res) => {
                    url = `https://${bucket}.${REACT_APP_SPACES_ENDPOINT}/${params.Key}`;
                })
                .catch((error) => console.error('s3Client error->', error));
        }

        return url;
    } catch (error) {
        console.error('Error upload bucket->', error);
    }
}

export const deleteFileFromBucket = async ({ bucket, folder, resourceName }: 
    { bucket: string, folder: string, resourceName: string }) => {
    const params = {
        Bucket: bucket,
        Key: resourceName
    };

    const deleteObject = new DeleteObjectCommand(params);

    s3Client.send(deleteObject)
        .then((res) => console.log(res))
        .catch((error) => console.error('Delete bucket error->', error));
}