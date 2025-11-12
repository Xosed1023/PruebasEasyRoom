import { createContext, ReactNode, useState } from "react"

export interface Filter {
    filter: string;
    fromHeader: string;
    idx: number;
    valueToDisplay?: ReactNode;
} 

export const FiltersContext = createContext<{
    selectedFilters?: Filter[]
    setSelectedFilters?: React.Dispatch<
        React.SetStateAction<
            | Filter[]
            | undefined
        >
    >
}>({})

export const RowSelectedContext = createContext<string>("")

export const TableFiltersProvider = ({ children }: { children: ReactNode }) => {
    const [selectedFilters, setSelectedFilters] = useState<{ filter: string; fromHeader: string; idx: number }[]>()
    return <FiltersContext.Provider value={{ selectedFilters, setSelectedFilters }}>{children}</FiltersContext.Provider>
}
