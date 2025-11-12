import { TiposPagos } from "src/gql/schema"
import Icon from "src/shared/icons"
import { IconProps } from "src/shared/icons/interfaces/IconProps.interface"

interface IconPaymentProps extends Omit<IconProps, "name"> {
    type: TiposPagos | (string & {})
}

function IconPayment({ type, ...rest }: IconPaymentProps): JSX.Element | null {
    return type === TiposPagos.Amex || type === TiposPagos.VisaOMastercard || type === TiposPagos.LovePoints ? (
        <Icon
            name={
                type === TiposPagos.LovePoints
                    ? "lovePoints"
                    : type === TiposPagos.Amex
                    ? "amex"
                    : type === TiposPagos.VisaOMastercard
                    ? "visa"
                    : "BankCard"
            }
            height={16}
            width={16}
            {...rest}
        />
    ) : null
}

export default IconPayment
