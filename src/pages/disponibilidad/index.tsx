import cx from "classnames"
import { useData } from "./hooks/data"
import Skeleton from "src/shared/components/layout/skeleton/Skeleton"
import ImageLogo from "src/shared/icons/Image"
import CarouselGroup from "./components/carousel-group"
import DateSection from "./components/date"
import Image from "./components/Image"
import Card from "./components/Card"
import CardListaEspera from "./components/CardListaEspera"
import "./Disponibilidad.css"
import Turno from "./components/turno/Turno"

function Disponibilidad(): JSX.Element {
    const { loading, logo, items, img_promo, lista_espera, folio_turn } = useData()

    const slides = [
        ...items.map((group, index) => (
            <div className="disp__card-list" key={`group-${index}`}>
                {group.map((item, key) => (
                    <Card key={key} logo={logo} {...item} />
                ))}
            </div>
        )),

        lista_espera && lista_espera.length > 0 ? (
            <div className="disp__card-list" key="lista-espera">
                <p className="disp__card-list-title">Lista de espera para habitaciones</p>
                {lista_espera.map((habitacionObj, index) => {
                    const nombreHabitacion = Object.keys(habitacionObj)[0]
                    const folios = habitacionObj[nombreHabitacion]
                    return <CardListaEspera key={index} nombreHabitacion={nombreHabitacion} folios={folios} />
                })}
            </div>
        ) : (
            !loading && (
                <div className="disp__empty-slide" key="sin-lista">
                    <p className="disp__empty-text">Sin lista de espera</p>
                </div>
            )
        ),
    ]
    return (
        <div className="disp__screen">
            <div className="disp__content">
                <div className="disp__card-section">
                    <CarouselGroup>{slides}</CarouselGroup>
                </div>
                <div className="disp__notices">
                    <div
                        className={cx({
                            "disp__notices-column": true,
                            "disp__notices-column__logo": !!logo,
                        })}
                    >
                        <div className="disp__notices-section disp__notices-section--header">
                            {logo && <img className="disp__logo" src={logo} />}
                            <div className="disp__date-wrapper">{true && <DateSection />}</div>
                        </div>
                        <div className="disp__notices-section disp__notices-section--turn">
                            {loading ? (
                                <Skeleton.Item className="disp__skeleton" />
                            ) : true ? (
                                folio_turn ? (
                                    <Turno folioTurno={folio_turn} />
                                ) : (
                                    <>
                                        <p className="disp__message">
                                            Si llevas más de <strong>30 min</strong> esperando,
                                            <br />
                                            <strong>¡Te invitamos una bebida!</strong>
                                        </p>
                                        <p className="disp__message-metodo">
                                            Métodos de pago: efectivo y tarjetas de crédito
                                        </p>
                                    </>
                                )
                            ) : (
                                <ImageLogo height={100} width={120} />
                            )}
                        </div>
                        <div className="disp__notices-section">
                            {loading ? (
                                <Skeleton.Item className="disp__skeleton" />
                            ) : true ? (
                                <CarouselGroup>
                                    <Image src={img_promo} />
                                </CarouselGroup>
                            ) : (
                                <ImageLogo height={164} width={182} />
                            )}
                        </div>
                    </div>
                </div>
                <Turno folioTurno={folio_turn} size="large" showDuration={10000} isModal={true}>
                    <span>Por favor, prepárate para tu atención.</span>
                </Turno>
            </div>
        </div>
    )
}

export default Disponibilidad
