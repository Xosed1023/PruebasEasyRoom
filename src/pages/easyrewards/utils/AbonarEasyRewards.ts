import { TiposPagos } from "src/gql/schema"

export const tiposPagosValidos = [
    TiposPagos.Efectivo,
    TiposPagos.VisaOMastercard,
    TiposPagos.Amex,
    TiposPagos.DepositoOTransferencia,
]

export const procesarMontos = (
    totalPagosValidos: number,
    totalPagosInvalidos: number,
    totalBebidas: number,
    totalAlimentos: number,
    totalSexAndSpa: number
) => {
    const esMayorBebidas = totalBebidas >= totalAlimentos
    const montoMayor = Math.max(totalBebidas, totalAlimentos)
    const montoMenor = Math.min(totalBebidas, totalAlimentos)
    const resultadoValidos = totalPagosValidos - totalSexAndSpa

    // Pagos válidos insuficientes
    if (resultadoValidos <= 0) {
        return resultadoValidos === 0 && totalSexAndSpa > 0
            ? { montoBebidas: 0, montoAlimentos: 0, montoSexAndSpa: totalPagosValidos }
            : { montoBebidas: 0, montoAlimentos: 0, montoSexAndSpa: 0 }
    }

    // Pagos inválidos
    if (totalPagosInvalidos > 0) {
        let resultadoInvalidos = totalPagosInvalidos - montoMayor
        if (resultadoInvalidos <= 0) {
            return {
                montoBebidas: esMayorBebidas ? totalPagosValidos : 0,
                montoAlimentos: esMayorBebidas ? 0 : totalPagosValidos,
                montoSexAndSpa: 0,
            }
        }

        resultadoInvalidos -= montoMenor
        if (resultadoInvalidos <= 0) {
            return {
                montoBebidas: esMayorBebidas ? 0 : totalPagosValidos,
                montoAlimentos: esMayorBebidas ? totalPagosValidos : 0,
                montoSexAndSpa: 0,
            }
        }
        return { montoBebidas: 0, montoAlimentos: 0, montoSexAndSpa: 0 }
    }
    return {
        montoBebidas: totalBebidas,
        montoAlimentos: totalAlimentos,
        montoSexAndSpa: totalSexAndSpa,
    }
}
