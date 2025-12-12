import { formatText } from "./formatTextOpcions"

export const enumToOptions = (enumObject: { [key: string]: string }): { label: string; value: string }[] => {
    return Object.keys(enumObject).map((value) => ({
        label: formatText(enumObject[value]),
        value: enumObject[value],
    }))
}
