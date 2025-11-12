import Drawer from "src/shared/components/layout/drawer/Drawer"
import "./Details.css"
import { useGetRecetaForDetailQuery } from "src/gql/schema"

export function OrderDetails({
    onClose,
    isOpen,
    idReceta,
}: {
    onClose: () => void
    isOpen: boolean
    idReceta: string
}): JSX.Element {
    const { data: receta } = useGetRecetaForDetailQuery({
        variables: { articulo_id: idReceta || "" },
    })

    return (
        <Drawer
            className="details-order__container"
            placement={"right"}
            bar={false}
            visible={isOpen}
            withCloseButton={true}
            onClose={() => onClose()}
        >
            <div className="product-details__drawer__header">
                <img
                    src={receta?.receta.articulo?.foto || require("src/assets/webp/Producto.webp")}
                    alt="Foto de producto"
                    className="product-details__drawer__header__img"
                />
                <div className="product-details__drawer__header__main">
                    <span className="product-details__drawer__header__main__title">
                        {receta?.receta.articulo?.nombre}
                    </span>
                </div>
            </div>
            <div className="product-details__drawer__body">
                <p className="details-order__container_title">Ingredientes</p>
                {receta?.receta.ingredientes_recetas?.map((ingrediente, index) => (
                    <div className="details-order__info_container" key={index}>
                        <p className="details-order__info_name">{ingrediente.articulo?.nombre}</p>
                        <div className="details-order__info_quantity_container">
                            <p className="details-order__info_quantity">{ingrediente?.cantidad}</p>
                            <p className="details-order__info_quantity">{ingrediente?.unidad}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Drawer>
    )
}
