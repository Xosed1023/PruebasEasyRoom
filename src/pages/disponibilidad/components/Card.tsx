import Icon from "src/shared/icons"
import { getCurrencyFormat } from "src/utils/string"

type CardProps = {
    image: string
    logo: string
    disponibles: number
    title: string
    hours: number
    size: number
    price: number
    priceBooking: number
    priceExtra: number
    maxExtra: number
}

function Card({
    image = "",
    logo = "",
    disponibles = 0,
    title = "",
    hours = 0,
    size = 0,
    price = 0,
    priceBooking = 0,
    priceExtra = 0,
    maxExtra = 0,
}: CardProps): JSX.Element {
    return (
        <div className="disp__card">
            <div className="disp__card-info">
                <div className="disp__card-image">
                    {image ? (
                        <img className="disp__card-img" width={"100%"} height={"100%"} src={image} />
                    ) : logo ? (
                        <img height={62} src={logo} />
                    ) : (
                        <Icon name={"image"} height={116} width={116} color={"var(--drawer)"} />
                    )}
                </div>
                <div className="disp__card-base">
                    <p className="disp__card-name">{title}</p>
                    <div
                        className="disp__card-state"
                        style={{ backgroundColor: disponibles > 0 ? "#10a31e" : "var(--ocupado)" }}
                    >
                        <p className="disp__card-state__value">{disponibles}</p>
                        <p className="disp__card-state__label">{"Disponibles"}</p>
                    </div>
                </div>
            </div>
            <div className="disp__card-row">
                <div className="disp__card-left">
                    <p className="disp__card-price">{getCurrencyFormat(price)}</p>
                    <div className="disp__card-item disp__card-item-space">
                        <Icon height={37} width={37} name={"Clock"} color={"var(--white)"} />
                        <span>{`${hours} h`}</span>
                    </div>
                    <div className="disp__card-item">
                        <Icon height={37} width={37} name={"userFilled"} color={"var(--white)"} />
                        <span>{`${size} px`}</span>
                    </div>
                </div>
                <div className="disp__card-right">
                    <div className="disp__card-description">
                        <Icon height={26} width={26} name={"calendarFill"} color={"var(--white)"} />
                        <div>
                            <p className="disp__card-description-label">{"Reservación"}</p>
                            <p className="disp__card-description-value">
                                {priceBooking ? (
                                    <>
                                        {getCurrencyFormat(priceBooking)} <span>{"x noche"}</span>
                                    </>
                                ) : (
                                    "N/A"
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="disp__card-description">
                        <Icon height={26} width={26} name={"userAdd"} color={"var(--white)"} />
                        <div>
                            <p className="disp__card-description-label">{"Persona extra"}</p>
                            <p className="disp__card-description-value">
                                {getCurrencyFormat(priceExtra)} <span>{`max ${maxExtra}`}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card
