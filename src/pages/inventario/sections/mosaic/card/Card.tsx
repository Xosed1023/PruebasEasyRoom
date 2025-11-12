import React from "react"

import "./Card.css"
import Header from "./sections/header/Header"
import Body from "./sections/body/Body"
import Footer from "./sections/footer/Footer"
import { InventoryItemProps } from "src/pages/inventario/interfaces/InventoryItem"
import { TipoArticulo } from "src/gql/schema"

const Card = ({
    article_id,
    content,
    estadoAlmacenArticulo,
    estadoArticulo,
    isInsumo,
    marca,
    measurement,
    mediumLimit,
    name,
    price,
    units,
    imgUrl,
    onSelectItem,
    onClickButton,
    type,
}: InventoryItemProps) => {
    return type === TipoArticulo.Venta ? (
        <div className="inventory-card" onClick={(e) => onSelectItem(article_id)}>
            <Header
                isInsumo={isInsumo}
                estadoAlmacenArticulo={estadoAlmacenArticulo}
                estadoArticulo={estadoArticulo}
                imgUrl={imgUrl}
                tipoArticulo={type}
            ></Header>
            <Body
                marca={marca}
                price={price}
                measurement={measurement}
                content={content}
                name={name}
                type={type}
            ></Body>
            <Footer
                estadoAlmacenArticulo={estadoAlmacenArticulo}
                estadoArticulo={estadoArticulo}
                units={units}
                onClickButton={onClickButton}
                measurement={measurement}
                type={type}
            ></Footer>
        </div>
    ) : type === TipoArticulo.Insumo ? (
        <div className="inventory-card" onClick={(e) => onSelectItem(article_id)}>
            <Header
                isInsumo={isInsumo}
                estadoAlmacenArticulo={estadoAlmacenArticulo}
                estadoArticulo={estadoArticulo}
                imgUrl={imgUrl}
                tipoArticulo={type}
            ></Header>
            <Body marca={marca} name={name} type={type}></Body>
            <Footer
                estadoAlmacenArticulo={estadoAlmacenArticulo}
                estadoArticulo={estadoArticulo}
                units={units}
                onClickButton={onClickButton}
                measurement={measurement}
                type={type}
            ></Footer>
        </div>
    ) : type === TipoArticulo.Proceso ? (
        <div className="inventory-card" onClick={(e) => onSelectItem(article_id)}>
            <Header
                isInsumo={isInsumo}
                estadoAlmacenArticulo={estadoAlmacenArticulo}
                estadoArticulo={estadoArticulo}
                imgUrl={imgUrl}
                tipoArticulo={type}
            ></Header>
            <Body name={name} type={type}></Body>
            <Footer
                estadoAlmacenArticulo={estadoAlmacenArticulo}
                estadoArticulo={estadoArticulo}
                units={units}
                onClickButton={onClickButton}
                measurement={measurement}
                type={type}
            ></Footer>
        </div>
    ) : (
        <></>
    )
}

export default Card
