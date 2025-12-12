import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import Icon from "src/shared/icons"
import "./InputFoto.css"
import ImageEditor from "../image-editor/ImageEditor"

// El valor inicial es un string (la url de la imagen o vacío), pero al cambiar su valor va a ser un File
interface ProfileImageUploadProps {
    onPictureChange: (file: File | null) => void
    pictureSrc?: string
    className?: string
    modalTitle: string
    modalSubtitle: string
}

export const InputFoto = ({ onPictureChange, pictureSrc, className = "", modalSubtitle, modalTitle }: ProfileImageUploadProps) => {
    const [selectedPicture, setSelectedPicture] = useState<File | null>(null)
    const [defaultSelectedPicture, setDefaultSelectedPicture] = useState<File | undefined>()
    const [isImageEditorModalOpen, setIsImageEditorModalOpen] = useState(false)

    const inputImageRef = useRef<HTMLInputElement | null>(null)

    async function urlToFile(url: string): Promise<File> {
        const response = await fetch(url)
        const blob = await response.blob()

        // Extraer el nombre del archivo de la URL
        const urlParts = url.split("/")
        const fileName = urlParts[urlParts.length - 1]

        // Determinar el tipo MIME del archivo
        const mimeType = blob.type

        const file = new File([blob], fileName, { type: mimeType })
        return file
    }

    const handleDefaultImage = () => {
        if (!defaultSelectedPicture && pictureSrc) {
            urlToFile(pictureSrc).then((f) => {
                setDefaultSelectedPicture(f)
            })
        }
    }

    useEffect(() => {
        handleDefaultImage()
    }, [])

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            const selectedFile = files[0]
            setSelectedPicture(selectedFile)
            onPictureChange(selectedFile)
            setIsImageEditorModalOpen(true)
        }
    }

    const handleIconClick = () => {
        if (inputImageRef.current) {
            inputImageRef.current.click() // Activa el evento click del input oculto
        }
    }

    return (
        <>
            <div className={"inputImage__image-container" + (className ? ` ${className}` : "")}>
                <div className="inputImage__marco">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }} // Oculta el input original
                        ref={inputImageRef}
                    />
                    {selectedPicture || pictureSrc ? (
                        <div className="inputImage">
                            <img
                                className="inputImage__icon-img"
                                src={selectedPicture ? URL.createObjectURL(selectedPicture) : pictureSrc}
                                alt="Profile"
                            />
                            <div className="inputImage__icon-edit">
                                <Icon
                                    name="pencil"
                                    color="#fff"
                                    width={15}
                                    height={15}
                                    className="inputImage__icon-edit__icon"
                                    onClick={handleIconClick}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="inputImage" onClick={handleIconClick}>
                                <Icon
                                    className="inputImage__icon-camara"
                                    color="var(--primary)"
                                    name="camara01"
                                    height={60}
                                    width={60}
                                />
                                <Icon className="inputImage__icon-plus" color="#fff" name="plus" />{" "}
                                {/* Aquí muestra tu componente de Icon */}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ImageEditor
                title={modalTitle}
                subtitle={modalSubtitle}
                isOpen={isImageEditorModalOpen}
                defaultImageSelected={defaultSelectedPicture}
                imageUrl={selectedPicture ? URL.createObjectURL(selectedPicture) : pictureSrc || ""}
                onChange={(file) => {
                    setSelectedPicture(file)
                    onPictureChange(file)
                }}
                onClose={() => {
                    setIsImageEditorModalOpen(false)
                }}
            />
        </>
    )
}
