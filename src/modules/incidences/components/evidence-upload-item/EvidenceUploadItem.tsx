import Icon from "@/icons"
import { ReactNode, useEffect, useState } from "react"
import styles from "./EvidenceUploadItem.module.css"
import { createPortal } from "react-dom"
import { usePickerImages } from "@/hooks/native/usePickerImages"
import { fileToBase64 } from "@/helpers/files"

type ModalImageProps = {
    isOpen: boolean
    children: ReactNode | ReactNode[]
}

type EvidenceUploadItemProps = {
    file: string | null
    onChange: (file: string | null) => void
}

type EvidenceUploadProps = {
    files: (string | null)[]
    onFilesChange: (files: (string | null)[]) => void
}

const ModalImage = ({ children, isOpen = true }: ModalImageProps) => {
    const portal = createPortal(
        <div className={styles["evidence-upload-item__modal"]}>{children}</div>,

        document.getElementById("snackbar") as HTMLElement
    )
    return isOpen ? portal : null
}

function EvidenceUploadItem({ file, onChange }: EvidenceUploadItemProps) {
    const [preview, setPreview] = useState<boolean>(false)
    const { handlePickerImage } = usePickerImages({
        onChange: ({ file }) => {
            fileToBase64(file)
                .then((base64) => {
                    if (base64) onChange(base64)
                })
                .catch(console.log)
        },
    })

    const value = file || ""

    return (
        <div className={styles["evidence-upload-item__box"]}>
            {value ? (
                <img
                    src={value}
                    alt={`preview`}
                    className={styles["evidence-upload-item__preview"]}
                    onClick={() => {
                        setPreview(true)
                        document.activeElement instanceof HTMLElement && document.activeElement.blur()
                    }}
                />
            ) : (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={handlePickerImage}
                >
                    <Icon
                        name="CameraPlus"
                        height={24}
                        width={24}
                        color="#9E77ED"
                        className={styles["evidence-upload-item__icon"]}
                    />
                </div>
            )}

            {preview && (
                <ModalImage isOpen={true}>
                    <Icon
                        name="Close"
                        height={20}
                        width={20}
                        color="#FFFFFF"
                        className={styles["evidence-upload-item__close"]}
                        onClick={() => {
                            setPreview(false)
                            document.activeElement instanceof HTMLElement && document.activeElement.blur()
                        }}
                    />

                    <div className={styles["evidence-upload-item__modal-content"]}>
                        <img src={value} alt="Preview" className={styles["evidence-upload-item__modal-img"]} />
                    </div>

                    <button
                        className={styles["evidence-upload-item__delete"]}
                        onClick={() => {
                            setPreview(false)
                            onChange(null)
                        }}
                    >
                        Eliminar fotografía
                    </button>
                </ModalImage>
            )}
        </div>
    )
}

function EvidenceUpload({ onFilesChange, files }: EvidenceUploadProps) {
    return (
        <div className={styles["evidence-upload-item__container"]}>
            {[0, 1, 2].map((index) => (
                <EvidenceUploadItem
                    key={index}
                    file={files?.[index] || null}
                    onChange={(file) => {
                        const array = files.map((f, i) => (i === index ? file : f))
                        onFilesChange(array)
                    }}
                />
            ))}
        </div>
    )
}

export const EvidenceUploadV1 = ({ onFilesChange }: { onFilesChange?: (files: (File | null)[]) => void }) => {
    const [files, setFiles] = useState<(File | null)[]>([null, null, null])
    const [previews, setPreviews] = useState<(string | null)[]>([null, null, null])
    const [selectedPreview, setSelectedPreview] = useState<string | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    useEffect(() => {
        const newPreviews = files.map((file) => (file ? URL.createObjectURL(file) : null))
        setPreviews(newPreviews)

        return () => {
            newPreviews.forEach((url) => {
                if (url) URL.revokeObjectURL(url)
            })
        }
    }, [files])

    const handleFileChange = (index: number, file: File) => {
        const updatedFiles = [...files]
        const updatedPreviews = [...previews]
        updatedFiles[index] = file
        updatedPreviews[index] = URL.createObjectURL(file)
        setFiles(updatedFiles)
        setPreviews(updatedPreviews)
        onFilesChange?.(updatedFiles)
    }

    const handleDelete = () => {
        if (selectedIndex === null) return
        const updatedFiles = [...files]
        const updatedPreviews = [...previews]
        updatedFiles[selectedIndex] = null
        updatedPreviews[selectedIndex] = null
        setFiles(updatedFiles)
        setPreviews(updatedPreviews)
        setSelectedPreview(null)
        setSelectedIndex(null)
        onFilesChange?.(updatedFiles)
    }

    return (
        <div className={styles["evidence-upload-item__container"]}>
            {[0, 1, 2].map((i) => (
                <div key={i} className={styles["evidence-upload-item__box"]}>
                    {previews[i] ? (
                        <img
                            src={previews[i]!}
                            alt={`preview-${i}`}
                            className={styles["evidence-upload-item__preview"]}
                            onClick={() => {
                                setSelectedPreview(previews[i])
                                setSelectedIndex(i)
                                document.activeElement instanceof HTMLElement && document.activeElement.blur()
                            }}
                        />
                    ) : (
                        <>
                            <input
                                type="file"
                                id={`upload-input-${i}`}
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        handleFileChange(i, e.target.files[0])
                                    }
                                }}
                            />
                            <label htmlFor={`upload-input-${i}`}>
                                <Icon
                                    name="CameraPlus"
                                    height={24}
                                    width={24}
                                    color="#9E77ED"
                                    className={styles["evidence-upload-item__icon"]}
                                />
                            </label>
                        </>
                    )}
                </div>
            ))}

            {selectedPreview && (
                <ModalImage isOpen={true}>
                    <Icon
                        name="Close"
                        height={20}
                        width={20}
                        color="#FFFFFF"
                        className={styles["evidence-upload-item__close"]}
                        onClick={() => {
                            setSelectedPreview(null)
                            setSelectedIndex(null)
                            document.activeElement instanceof HTMLElement && document.activeElement.blur()
                        }}
                    />

                    <div className={styles["evidence-upload-item__modal-content"]}>
                        <img
                            src={selectedPreview}
                            alt="Preview"
                            className={styles["evidence-upload-item__modal-img"]}
                        />
                    </div>

                    <button className={styles["evidence-upload-item__delete"]} onClick={handleDelete}>
                        Eliminar fotografía
                    </button>
                </ModalImage>
            )}
        </div>
    )
}

export default EvidenceUpload
