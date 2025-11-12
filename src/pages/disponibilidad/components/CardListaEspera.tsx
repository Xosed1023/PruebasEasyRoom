type CardListaEsperaProps = {
    nombreHabitacion: string
    folios: string[]
}

function CardListaEspera({ nombreHabitacion, folios }: CardListaEsperaProps): JSX.Element {
    const tieneFolio = folios && folios.length > 0
    return (
        <div className="disp__card-waiting-list">
            <div className="disp__card-waiting-list-left">
                <p className="disp__card-waiting-list-title">{nombreHabitacion}</p>
            </div>
            <div className="disp__card-waiting-list-right">
                {tieneFolio && (
                    <>
                        <p className="disp__card-waiting-list-label">Próximo turno</p>
                        <p className="disp__card-waiting-list-values">
                            <span style={{ fontWeight: 700 }}>{folios[0]}</span>
                            {folios.slice(1).map((folio, index) => (
                                <span key={index} style={{ fontWeight: 400 }}>
                                    {" "}
                                    / {folio}
                                </span>
                            ))}
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default CardListaEspera
