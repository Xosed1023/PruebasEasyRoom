import { Camera, CameraResultType } from "@capacitor/camera"
import { base64ToFile } from "@/helpers/files"

type Value = {
    url: string
    file: File
}

type UsePickerImagesParams = {
    onChange: (value: Value) => void
}

export function usePickerImages({ onChange }: UsePickerImagesParams) {
    const handleTakePicture = () => {
        Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64,
        })
            .then((image) => {
                if (image?.base64String) {
                    const base64 = image.base64String!
                    const mimeType = image.format === "jpeg" ? "image/jpeg" : "image/png"
                    const fileName = `photo.${image.format}`
                    const file = base64ToFile(base64, fileName, mimeType)
                    onChange({ url: URL.createObjectURL(file), file })
                }
            })
            .catch((e: any) => {
                console.log(e)
            })
    }

    const handlePickerImage = () => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.style.display = "none"

        input.onchange = (event) => {
            const file = event?.target?.["files"]?.[0]
            if (file) {
                onChange({ url: URL.createObjectURL(file), file })
            }
            document.body.removeChild(input)
        }

        document.body.appendChild(input)
        input.click()
    }

    return {
        handleTakePicture,
        handlePickerImage,
    }
}
