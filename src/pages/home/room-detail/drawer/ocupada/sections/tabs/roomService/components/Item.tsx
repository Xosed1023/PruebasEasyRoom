import { getCurrencyFormat } from "src/utils/string"
import DropdownMenu from "src/shared/components/data-display/dropdown-menu/DropdownMenu"
import { EstadosOrdenHistorial } from "src/gql/schema"
import Icon from "src/shared/icons"
import "./index.css"

type Extra = {
    label: string
    value: number
    size?: number
}

interface Articulo extends Extra {
    comment: string
    extras: Extra[]
}

type ItemProps = {
    title: string
    description: string
    propina?: number
    icon?: string
    data: Articulo[]
    options: any[]
    estado?: EstadosOrdenHistorial | string
    total_con_iva?: number
    hideDetailsConditionally?: boolean
}

const Description = ({ size = 0, label = "", amount = 0 }) => (
    <div className="detalle-h-rs__item__d">
        <span className="detalle-h-rs__item__d__label">{`${size ? `(${size})` : ""} ${label}`}</span>
        <span className="detalle-h-rs__item__d__label">{getCurrencyFormat(amount)}</span>
    </div>
)

function Item({
    title = "",
    description = "",
    icon = "Dollar",
    data = [],
    options = [],
    propina = 0,
    estado = undefined,
    total_con_iva = 0,
    hideDetailsConditionally = false,
}: ItemProps): JSX.Element {
    const isOrdenEnEntrega = estado === EstadosOrdenHistorial.EnEntrega
    const shouldShowDetails = !hideDetailsConditionally || isOrdenEnEntrega

    return (
        <div className="detalle-h-rs__item">
            <div className="detalle-h-rs__item__left">
                <Icon name={icon} height={14} width={14} color={"var(--white)"} />
                <div className="detalle-h-rs__item__line" />
            </div>
            <div className="detalle-h-rs__item__right">
                <div className="detalle-h-rs__item__head">
                    <div className="detalle-h-rs__item__title__wrapper">
                        <span className="detalle-h-rs__item__title">{title}</span>
                        {hideDetailsConditionally && !shouldShowDetails && (
                            <span className="detalle-h-rs__item__title__total">{getCurrencyFormat(total_con_iva)}</span>
                        )}
                    </div>
                    {shouldShowDetails && options && options.length > 0 && (
                        <DropdownMenu containerClassName="detalle-h-rs__item__btn" items={options}>
                            <Icon name={"MoreFill"} height={4} width={18} color={"var(--white)"} />
                        </DropdownMenu>
                    )}
                </div>
                {shouldShowDetails && description && <p className="detalle-h-rs__item__subtitle">{description}</p>}
                {shouldShowDetails &&
                    data.map((a, index) => (
                        <div className="" key={index}>
                            <Description size={a.size} label={a.label} amount={a.value} />
                            <div className="detalle-h-rs__item__detail">
                                {a.comment && (
                                    <div className="detalle-h-rs__item__comment">
                                        <Icon height={12} width={12} color={"var(--white)"} name={"chatLeft"} />
                                        <p className="detalle-h-rs__item__comment__value">{a.comment}</p>
                                    </div>
                                )}
                                {a.extras?.map((e, index) => (
                                    <Description key={index} size={e.size} label={e.label} amount={e.value} />
                                ))}
                            </div>
                        </div>
                    ))}
                {shouldShowDetails && propina > 0 && <Description label={"Propina"} amount={propina || 0} />}
            </div>
        </div>
    )
}

export default Item
