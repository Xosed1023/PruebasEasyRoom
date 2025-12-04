import { CSSProperties, JSXElementConstructor, memo, ReactElement, useEffect, useRef, useState } from "react"
import { DocumentProps, pdf } from "@react-pdf/renderer"
import { Document, Page } from "react-pdf"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"

interface PDFCanvasProps {
    children: ReactElement<DocumentProps, string | JSXElementConstructor<any>>
    style: CSSProperties
}

const options = {
    cMapUrl: "/cmaps/",
}

function PDFCanvas({ children, style }: PDFCanvasProps) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [pageWidth, setPageWidth] = useState(0)

    const [numPages, setNumPages] = useState<number>(0)

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages ?? 0)
    }

    useEffect(() => {
        let isMounted = true
        pdf(children)
            .toBlob()
            .then((blob) => {
                if (!isMounted) return
                const url = URL.createObjectURL(blob)
                setPdfUrl(url)
            })

        return () => {
            isMounted = false
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl)
            }
        }
    }, [children]) // si el contenido del PDF cambia, se regenera

    useEffect(() => {
        if (!containerRef.current) return

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setPageWidth(entry.contentRect.width)
            }
        })

        observer.observe(containerRef.current)

        return () => observer.disconnect()
    }, [pdfUrl])

    if (!pdfUrl) return <p>Generando PDF...</p>

    return (
        <div ref={containerRef} className="flex justify-center w-full" style={style}>
            <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={10} // zoom máximo
                doubleClick={{ disabled: false }}
                pinch={{ disabled: false }}
            >
                <TransformComponent>
                    <Document key={pdfUrl} options={options} file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                        {numPages != null &&
                            Array.from(new Array(numPages), (_el, index) => (
                                <Page
                                    width={pageWidth}
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            ))}
                    </Document>
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
}

export default memo(PDFCanvas)
