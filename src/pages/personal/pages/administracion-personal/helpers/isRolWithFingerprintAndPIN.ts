import { Puesto } from "src/gql/schema"
const isRolWithFingerprintAndPIN = ({ selectedRol, roles = [] }: { selectedRol: string; roles?: Puesto[] }) => {
    const rolesWithFingerprintAndPIN = [
        "Gerente general",
        "Gerente operativo",
        "Mesero",
        "Bartender",
        "Valet parking",
        "Recepcionista",
        "Administrador",
        "Sistemas",
        "Chef",
        "Cocinero",
        "Ayudante de cocina",
    ]

    return roles.some(rol => rolesWithFingerprintAndPIN.find(r => r === rol.nombre && rol.puesto_id === selectedRol))
}

export default isRolWithFingerprintAndPIN
