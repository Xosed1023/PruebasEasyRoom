import { EstadosAlmacenesArticulos, EstadosArticulo, TipoArticulo } from "src/gql/schema"
import PhotoEmpty from "src/pages/inventario/components/empty/PhotoEmpty"
import "./Header.css"

interface HeaderProps {
    imgUrl?: string
    // producto o insumof
    isInsumo: boolean
    estadoArticulo: EstadosArticulo
    estadoAlmacenArticulo: EstadosAlmacenesArticulos
    tipoArticulo: TipoArticulo
}

const Header = ({ imgUrl, estadoAlmacenArticulo, estadoArticulo, tipoArticulo }: HeaderProps) => {
    const setHeader = () => {
        if (imgUrl) {
            return (
                <img
                    src={imgUrl}
                    alt="Imagen de producto o insumo"
                    className={`inventory-card__header__img ${
                        estadoArticulo === EstadosArticulo.Desactivado ? "inventory-card__header--grayscale" : ""
                    }`}
                />
            )
        } else {
            return <PhotoEmpty tipo={tipoArticulo} estado={estadoArticulo} diameter={90} grayScale={true} />
        }
    }

    const setHeaderText = () => {
        if (estadoArticulo === EstadosArticulo.Desactivado) {
            return (
                <div className="inventory-card__header__badge--disabled">
                    <span>Desactivado</span>
                </div>
            )
        }
        if (estadoAlmacenArticulo === EstadosAlmacenesArticulos.Agotado) {
            return (
                <div className="inventory-card__header__badge--sold-out">
                    <span>Agotado</span>
                </div>
            )
        }
    }

    return (
        <div className="inventory-card__header">
            {setHeader()}
            {setHeaderText()}
        </div>
    )
}

export default Header
