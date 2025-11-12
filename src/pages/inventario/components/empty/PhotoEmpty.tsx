import { EstadosArticulo, TipoArticulo } from "src/gql/schema"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import "./index.css"

type PhotoEmptyProps = {
    tipo?: string
    estado?: string
    diameter: number
    grayScale?: boolean
}

function PhotoEmpty({ tipo = "", estado = "", diameter = 90, grayScale = false }: PhotoEmptyProps): JSX.Element {
    return (
        <IconBorder
            primaryBgColor="var(--fondo-close)"
            primaryBgDiameter={diameter}
            className={`${
                estado === EstadosArticulo.Desactivado
                    ? grayScale
                        ? "photo-empty--grayscale"
                        : "photo-empty--opacity"
                    : ""
            }`}
        >
            <Icon
                name={
                    tipo === TipoArticulo.Insumo
                        ? "Insumo"
                        : tipo === TipoArticulo.Proceso
                        ? "RecipeHistory"
                        : "FoodAndDrink"
                }
                color="var(--primary)"
                width={diameter / 2}
                height={diameter / 2}
            ></Icon>
        </IconBorder>
    )
}

export default PhotoEmpty
