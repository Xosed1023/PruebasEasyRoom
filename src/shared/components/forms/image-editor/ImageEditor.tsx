import React, { useEffect, useRef, useState } from "react"

import "./ImageEditor.css"
import { Modal } from "../../layout/modal/Modal"
import ModalContent from "../../modal/sections/ModalContent/ModalContent"
import ModalRow from "../../modal/sections/ModalRow/ModalRow"
import ModalBody from "../../modal/sections/ModalBody/ModalBody"
import ModalFooter from "../../modal/sections/ModalFooter/ModalFooter"
import IconBorder from "../../data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import InputRangeButtons from "./sections/InputRangeButtons/InputRangeButtons"
import { Button } from "../button/Button"
import { v4 as uuid } from "uuid"
import useSnackbar from "src/shared/hooks/useSnackbar"

const imgInitialPosition = { x: 0, y: 0 }

const ImageEditor = ({
    imageUrl,
    onChange,
    onClose,
    isOpen,
    title,
    subtitle,
    defaultImageSelected,
}: {
    imageUrl: string
    isOpen: boolean
    onChange: (file: File | null) => void
    onClose: () => void
    title: string
    subtitle: string
    defaultImageSelected?: File
}) => {
    const [scale, setScale] = useState(1)

    const [position, setPosition] = useState(imgInitialPosition)
    const [prevPosition, setPrevPosition] = useState(imgInitialPosition)
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
    const [isDragging, setisDragging] = useState(false)
    const [imageFormat, setImageFormat] = useState<string | null>(null)

    const imageRef = useRef<HTMLImageElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const hiddenInputRef = useRef<HTMLInputElement>(null)

    const { showSnackbar } = useSnackbar()

    const getImageFormat = (type: string) => {
        return type.split("/")[1]
    }

    const isValidImageFormat = (format: string) => {
        const imageFormats = [
            "jpeg",
            "jpg",
            "png",
            "gif",
            "bmp",
            "tiff",
            "tif",
            "webp",
            "svg",
            "heif",
            "heic",
            "raw",
            "cr2",
            "nef",
            "orf",
            "sr2",
            "psd",
            "avif",
            "ico",
        ]
        return imageFormats.find((f) => f === format)
    }

    const resetEditorState = () => {
        setPosition(imgInitialPosition)
        setPrevPosition(imgInitialPosition)
        setScale(1)
        setImageDataUrl(null)
        setImageFormat(null)
        setisDragging(false)
    }

    useEffect(() => {
        if (!imageUrl) {
            return
        }
        setPosition(imgInitialPosition)
        setPrevPosition(imgInitialPosition)
        setScale(1)

        const scaleImage = async (url: string) => {
            const response = await fetch(url)
            const blob = await response.blob()
            const reader = new FileReader()
            const format = getImageFormat(blob.type)

            if (!isValidImageFormat(format)) {
                showSnackbar({
                    title: "Error al seleccionar imagen",
                    text: "Formato de imagen no válido",
                    status: "error",
                })
                onClose()
                onChange(defaultImageSelected || null)
                return
            }

            setImageFormat(format)
            reader.onloadend = () => {
                const img = new Image()
                img.onload = () => {
                    const maxWidth = 300
                    const maxHeight = 300

                    let width = img.width
                    let height = img.height

                    while (width > maxWidth || height > maxHeight) {
                        // Adjust width first
                        if (width > maxWidth) {
                            height *= maxWidth / width
                            width = maxWidth
                        }

                        // Adjust height if necessary
                        if (height > maxHeight) {
                            width *= maxHeight / height
                            height = maxHeight
                        }
                    }

                    const canvas = document.createElement("canvas")
                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext("2d")
                    ctx?.clearRect(0, 0, canvas.width, canvas.height)
                    ctx?.drawImage(img, position.x, position.y, width, height)

                    const dataUrl = canvas.toDataURL("image/png")
                    setImageDataUrl(dataUrl)
                }
                img.src = reader.result as string
            }
            reader.readAsDataURL(blob)
        }

        scaleImage(imageUrl)
    }, [imageUrl])

    useEffect(() => {
        if (!isOpen) {
            resetEditorState()
        }
    }, [isOpen])

    useEffect(() => {
        const handleMouseUpGlobal = () => {
            setisDragging(false)
        }

        document.addEventListener("mouseup", handleMouseUpGlobal)

        return () => {
            document.removeEventListener("mouseup", handleMouseUpGlobal)
        }
    }, [])

    const handleMouseMove = (e) => {
        if (!isDragging) return
        const deltaX = e.clientX - prevPosition.x
        const deltaY = e.clientY - prevPosition.y
        setPrevPosition({ x: e.clientX, y: e.clientY })

        setPosition((position) => ({
            x: position.x + deltaX,
            y: position.y + deltaY,
        }))
    }

    const handleMouseDown = (e) => {
        setisDragging(true)
        setPrevPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseUp = () => {
        setisDragging(false)
    }

    const handleConfirm = () => {
        const canvas = canvasRef.current
        const image = imageRef.current
        handleMouseUp()
        if (!canvas || !image) {
            return
        }
        const ctx = canvas.getContext("2d")
        if (ctx) {
            const { distanceX, distanceY } = getDistance()

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = "#FFFFFF"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.drawImage(image, distanceX, distanceY, image.width * scale, image.height * scale)

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `${uuid()}.${imageFormat}`, { type: `image/${imageFormat}` })
                    onChange(file)
                    onClose()
                    if (hiddenInputRef.current) {
                        const dataTransfer = new DataTransfer()
                        dataTransfer.items.add(file)
                        hiddenInputRef.current.files = dataTransfer.files
                    }
                }
            }, `image/${imageFormat}`)
        }
    }

    // Obtener la distancia entre la esquina superior izquierda de la imagen a la esquina superior izquierda del canvas para conocer desde que punto dibujar la foto
    const getDistance = () => {
        const image = imageRef.current
        const canvas = canvasRef.current
        let distanceX = 0
        let distanceY = 0
        if (image && canvas) {
            const frameRect = image.getBoundingClientRect()
            const canvasRect = canvas.getBoundingClientRect()
            distanceX = frameRect.left - canvasRect.left
            distanceY = frameRect.top - canvasRect.top
            return { distanceX, distanceY }
        }
        return { distanceX, distanceY }
    }

    return (
        <Modal
            width={610}
            height={570}
            withCloseButton
            onClose={() => {
                onClose()
                onChange(defaultImageSelected || null)
                handleMouseUp()
            }}
            isOpen={isOpen}
            style={{ padding: "25px" }}
            isCancelableOnClickOutside={false}
        >
            <ModalContent>
                <ModalRow style={{ alignItems: "flex-start" }}>
                    <IconBorder
                        primaryBgColor="var(--primary-variant2)"
                        secondaryBgColor="var(--fondo-close)"
                        primaryBgDiameter={40}
                        secondaryBgDiameter={56}
                    >
                        <Icon name="userFilled" height={24} width={24} color="var(--primary)" />
                    </IconBorder>
                </ModalRow>
                <ModalRow style={{ alignItems: "flex-start" }}>
                    <p className="image-selector__title">{title}</p>
                </ModalRow>
                <ModalRow style={{ alignItems: "flex-start" }}>
                    <p className="image-selector__subtitle">{subtitle}</p>
                </ModalRow>
                <ModalBody>
                    <div className="image-selector__wrapper">
                        <div
                            style={{
                                backgroundColor: "#D9D9D9",
                                borderRadius: "5px",
                                position: "relative",
                                overflow: "hidden",
                                width: "300px",
                                height: "298px",
                            }}
                        >
                            {imageDataUrl && (
                                <>
                                    <img
                                        src={imageDataUrl}
                                        ref={imageRef}
                                        style={{
                                            height: "auto",
                                            cursor: "move",
                                            overflow: "hidden",
                                            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                        }}
                                        draggable={false}
                                        onMouseUp={handleMouseUp}
                                        onMouseMove={handleMouseMove}
                                        onMouseDown={handleMouseDown}
                                    />
                                    <div className="modal-input-foto-frame"></div>
                                </>
                            )}
                            <canvas
                                ref={canvasRef}
                                style={{ display: "block", position: "absolute", bottom: "0", pointerEvents: "none" }}
                                width={300}
                                height={300}
                            ></canvas>
                            <input type="file" ref={hiddenInputRef} style={{ display: "none" }} />
                        </div>
                    </div>
                    <InputRangeButtons onSliderChange={(v) => setScale(v)} />
                </ModalBody>
                <ModalFooter>
                    <div className="image-selector__footer">
                        <Button
                            type={"button"}
                            className="image-selector__footer__button"
                            text={"Cancelar"}
                            theme={"secondary"}
                            onClick={() => {
                                onClose()
                                onChange(defaultImageSelected || null)
                            }}
                        />
                        <Button
                            type={"button"}
                            text={"Aceptar"}
                            className="image-selector__footer__button"
                            theme={"primary-resumen"}
                            onClick={handleConfirm}
                        />
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ImageEditor
