import { ReactNode } from "react"
import Carousel from "../carousel/Carousel"

type Props = {
    children: ReactNode | ReactNode[]
}

function CarouselGroup({ children }: Props) {
    return Array.isArray(children) && children.length > 1 ? (
        <Carousel timeout={10000} itemsPerPage={1} innerPaginator>
            {children}
        </Carousel>
    ) : (
        children
    )
}

export default CarouselGroup
