import { useState } from "react"
import { Reserva } from "src/gql/schema"
import { sum } from "src/shared/helpers/calculator"

const useReservaPayments = ({ reserva }: { reserva?: Reserva }) => {
    const [reservaSeleccionada, setReservaSeleccionada] = useState(reserva)

    const updateReserva = ({ reserva }: { reserva?: Reserva }) => {
        setReservaSeleccionada(reserva)
    }

    return {
        pagosReserva:
            [],
        totalReservaPagos: sum(reservaSeleccionada?.pagos?.map((p) => p.total || 0) || [0]),
        updateReserva
    }

}

export default useReservaPayments
