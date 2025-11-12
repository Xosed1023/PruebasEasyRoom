import { EstadosArticulo } from "src/gql/schema"
import PhotoEmpty from "src/pages/inventario/components/empty/PhotoEmpty"
import "./Header.css"

type HeaderProps = { photoUrl?: string; title: string; subtitle: string; status?: string; type?: string }

const Header = ({ photoUrl, title, subtitle, status, type }: HeaderProps) => {
    const active = status === EstadosArticulo.Activado
    return (
        <div className="product-details__drawer__header">
            {photoUrl ? (
                <img
                    src={photoUrl}
                    alt="Foto de artículo"
                    className={`product-details__drawer__header__img${
                        !active ? " product-details__drawer__header__img--opacity" : ""
                    }`}
                />
            ) : (
                <PhotoEmpty estado={status} tipo={type} diameter={60} />
            )}
            <div className="product-details__drawer__header__main">
                <span className="product-details__drawer__header__main__title">{title}</span>
                <span className="product-details__drawer__header__main__subtitle">{subtitle}</span>
                {!active && <p className="product-details__drawer__header__main__alert">{"Desactivado"}</p>}
            </div>
        </div>
    )
}

export default Header
