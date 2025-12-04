import { DetailedHTMLProps, ImgHTMLAttributes } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

interface ImageZoomProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    src: string
}

function ImageZoom({ ...rest }: ImageZoomProps) {
    return (
        <TransformWrapper>
            <TransformComponent>
                <img {...rest} />
            </TransformComponent>
        </TransformWrapper>
    )
}

export default ImageZoom
