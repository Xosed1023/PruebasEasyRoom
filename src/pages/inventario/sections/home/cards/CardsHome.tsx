import cx from "classnames"
import Card from "src/shared/components/data-display/card/Card"
import "../../../Inventario.css"

export const CardsHome = ({ data }: { data: any }) => {
    return (
        <div className="inventario-screen__cards animante__select">
            {data.map(({ title = "", number = "", titleToolTip = "", toolTip = "", unidad = "" }, index) => (
                <Card
                    key={index}
                    containerClassName={cx("inventario-screen__card-item")}
                    className={"cortes-screen__card__contain"}
                    percent={""}
                    title={title}
                    number={number}
                    titleToolTip={titleToolTip}
                    toolTip={toolTip}
                    unidades={unidad}
                />
            ))}
        </div>
    )
}
