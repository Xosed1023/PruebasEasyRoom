import { Button } from "src/shared/components/forms"

function Home({ onClose, onConfirm, load }): JSX.Element {
    return (
        <section className="cortes__cancelacion__view">
            <div className="cortes__cancelacion__content">
                <div className="cortes__cancelacion__icon__contain">
                    <div className="cortes__cancelacion__icon">
                        <span>{"!"}</span>
                    </div>
                </div>
                <h5 className="cortes__cancelacion__title">{"¿Deseas cancelar este movimiento?"}</h5>
                <p className="cortes__cancelacion__description">
                    {
                        "La cancelación de este movimiento restará el monto en el corte actual y, si aplica, también las propinas asociadas."
                    }
                </p>
                <p className="cortes__cancelacion__note">{"Esta acción no se puede revertir."}</p>
            </div>
            <div className="cortes__cancelacion__footer">
                <Button disabled={load} className="cortes__cancelacion__btn" text="Cancelar" theme={"secondary"} onClick={onClose} />
                <Button disabled={load} className="cortes__cancelacion__btn" text={"Continuar"} onClick={onConfirm} />
            </div>
        </section>
    )
}

export default Home
