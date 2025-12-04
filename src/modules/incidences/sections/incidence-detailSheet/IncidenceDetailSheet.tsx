import { Drawer, DrawerContent } from "@/components/ui/drawer/Drawer"
import styles from "./IncidenceDetailSheet.module.css"
import Icon from "@/icons"
import { formatDate } from "@/utils/formatDate"
import { Props } from "./IncidenceDetailSheet.type"
import { capitalize } from "@/utils/capitalize"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import ImageZoom from "@/components/ui/image-zoom/ImageZoom"
import IncidenceDetailSkeleton from "../../components/Incidence-detail-skeleton/IncidenceDetailSkeleton"


const PreviewImage = ({ url, onClose }: { url: string; onClose: () => void }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
        window.addEventListener("keydown", onKey)
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            window.removeEventListener("keydown", onKey)
            document.body.style.overflow = prev
        }
    }, [onClose])

    return createPortal(
        <div className={styles["incidence-detail-sheet__PreviewImage"]}>
            <div
                className={styles["incidence-detail-sheet__PreviewImage-backdrop"]}
                onPointerDown={onClose}
                onClick={onClose}
            />

            <div
                className={styles["incidence-detail-sheet__PreviewImage-content"]}
                onClick={(e) => e.stopPropagation()}
                onPointerDownCapture={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className={styles["incidence-detail-sheet__PreviewImage-close"]}
                    aria-label="Cerrar"
                    onPointerDown={(e) => {
                        e.stopPropagation()
                        onClose()
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                        onClose()
                    }}
                >
                    <Icon name="Close" width={24} height={24} color="#FFFFFF" />
                </button>

                <div className={styles["incidence-detail-sheet__PreviewImage-img"]}>
                    <ImageZoom
                        className={styles["incidence-detail-sheet__PreviewImage__img"]}
                        src={url}
                        alt="Evidencia"
                    />
                </div>
            </div>
        </div>,
        document.body
    )
}

export const IncidenceDetailSheet = ({ open, onClose, incidence, isLoading = false }: Props) => {
    const photoUrls: string[] = (() => {
        if (!incidence) return []

        const fromPhotos = Array.isArray((incidence as any).photos)
            ? (((incidence as any).photos as Array<string | { url?: string; imagen?: string }>)
                  .map((p) => (typeof p === "string" ? p : p?.url || p?.imagen))
                  .filter(Boolean) as string[])
            : []

        if (fromPhotos.length) return fromPhotos

        const fromImagenes = Array.isArray((incidence as any).imagenes)
            ? (((incidence as any).imagenes as Array<{ imagen?: string; url?: string }>)
                  .map((i) => i?.imagen || i?.url)
                  .filter(Boolean) as string[])
            : []

        return fromImagenes
    })()
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const handleDrawerChange = (nextOpen: boolean) => {
        if (previewUrl) return
        if (!nextOpen) onClose()
    }

    return (
        <Drawer open={open} onOpenChange={handleDrawerChange}>
            <DrawerContent
                className="pb-8"
                onInteractOutside={(e) => {
                    if (previewUrl) e.preventDefault()
                }}
                onPointerDownOutside={(e) => {
                    if (previewUrl) e.preventDefault()
                }}
            >
                <div className={styles["incidence-detail-sheet__container"]}>
                    <h3 className={styles["incidence-detail-sheet__title"]}>Detalle de incidencia</h3>

                    {isLoading || !incidence ? (
                        <IncidenceDetailSkeleton />
                    ) : (
                        <>
                            <div>
                                <p className={styles["incidence-detail-sheet__label"]}>Folio de incidencia</p>
                                <p className={styles["incidence-detail-sheet__text"]}>
                                    {incidence.folio ?? incidence.id}
                                </p>
                            </div>

                            <div>
                                <p className={styles["incidence-detail-sheet__label"]}>Fecha y hora</p>
                                <p className={styles["incidence-detail-sheet__text"]}>
                                    {incidence.fechaRegistro
                                        ? formatDate(incidence.fechaRegistro)
                                        : "Fecha no disponible"}
                                </p>
                            </div>

                            <div>
                                <p className={styles["incidence-detail-sheet__label"]}>Turno</p>
                                <p className={styles["incidence-detail-sheet__text"]}>{capitalize(incidence.turno)}</p>
                            </div>

                            <div>
                                <p className={styles["incidence-detail-sheet__label"]}>
                                    {incidence.origen === "huesped" ? "Severidad" : "Urgencia"}
                                </p>
                                <p className={styles["incidence-detail-sheet__text"]}>
                                    {capitalize(incidence.urgencia)}
                                </p>
                            </div>

                            {incidence.origen === "habitaciones" && (
                                <>
                                    <div>
                                        <p className={styles["incidence-detail-sheet__label"]}>Habitación</p>
                                        <p className={styles["incidence-detail-sheet__text"]}>{incidence.habitacion}</p>
                                    </div>
                                    <div>
                                        <p className={styles["incidence-detail-sheet__label"]}>Tipo de incidencia</p>
                                        <p className={styles["incidence-detail-sheet__text"]}>
                                            {capitalize(incidence.tipoIncidencia)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={styles["incidence-detail-sheet__label"]}>Reportado por</p>
                                        <p className={styles["incidence-detail-sheet__text"]}>
                                            {capitalize(incidence.reportadoPor)}
                                        </p>
                                    </div>
                                </>
                            )}

                            {incidence.origen === "instalaciones" && (
                                <>
                                    <div>
                                        <p className={styles["incidence-detail-sheet__label"]}>Tipo de incidencia</p>
                                        <p className={styles["incidence-detail-sheet__text"]}>
                                            {capitalize(incidence.tipoIncidencia)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={styles["incidence-detail-sheet__label"]}>Reportado por</p>
                                        <p className={styles["incidence-detail-sheet__text"]}>
                                            {capitalize(incidence.reportadoPor)}
                                        </p>
                                    </div>
                                </>
                            )}

                            {incidence.origen === "huesped" && (
                                <>
                                    <div>
                                        <p className={styles["incidence-detail-sheet__label"]}>Tipo de incidencia</p>
                                        <p className={styles["incidence-detail-sheet__text"]}>
                                            {capitalize(incidence.tipoIncidencia)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={styles["incidence-detail-sheet__label"]}>
                                            Nombre del responsable
                                        </p>
                                        <p className={styles["incidence-detail-sheet__text"]}>
                                            {incidence.responsable}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={styles["incidence-detail-sheet__label"]}>Matrícula de auto</p>
                                        <p className={styles["incidence-detail-sheet__text"]}>{incidence.matricula}</p>
                                    </div>
                                    <div>
                                        <p className={styles["incidence-detail-sheet__label"]}>Reportado por</p>
                                        <p className={styles["incidence-detail-sheet__text"]}>
                                            {capitalize(incidence.reportadoPor)}
                                        </p>
                                    </div>
                                </>
                            )}

                            <div>
                                <p className={styles["incidence-detail-sheet__label"]}>Detalle de la incidencia</p>
                                <p className={styles["incidence-detail-sheet__text"]}>
                                    {capitalize(incidence.description)}
                                </p>
                            </div>

                            <div>
                                <p className={styles["incidence-detail-sheet__label"]}>Evidencia fotográfica</p>
                                <div className={styles["incidence-detail-sheet__photos"]}>
                                    {photoUrls.length > 0 ? (
                                        photoUrls.map((url, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                className={styles["incidence-detail-sheet__photo"]}
                                                onClick={() => setPreviewUrl(url)}
                                                aria-label={`Abrir evidencia ${index + 1}`}
                                            >
                                                <img src={url} alt={`evidencia-${index}`} />
                                            </button>
                                        ))
                                    ) : (
                                        <p className={styles["incidence-detail-sheet__no-photo"]}>N/A</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </DrawerContent>
            {previewUrl && <PreviewImage url={previewUrl} onClose={() => setPreviewUrl(null)} />}
        </Drawer>
    )
}
