
import Dropdown from 'src/shared/components/forms/selelct-dropdown/Dropdown'
import { dates } from '../../Inicio.constants'
import './Select.css'

export const Select = (): JSX.Element => {
    return <Dropdown icon={"calendar01"} className="reservas-screen__select" options={dates} placeholder="Fecha" />
}