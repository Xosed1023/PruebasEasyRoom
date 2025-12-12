import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

const MaxHeightContext = createContext<{
    maxHeight: string
}>({ maxHeight: "" })

export const MaxHeightProvider = ({ children }: { children: ReactNode }) => {
    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)
    const [maxHeight, setMaxHeight] = useState("")
    const handleNamesResize = () => {
        setMaxHeight(`calc(calc(90vh - 200px) / ${roomsDimensions?.x})`)
    }
    useEffect(() => {
        handleNamesResize()
        window.addEventListener("resize", handleNamesResize)
        return () => {
            window.removeEventListener("resize", handleNamesResize)
        }
    }, [])

    return <MaxHeightContext.Provider value={{ maxHeight }}>{children}</MaxHeightContext.Provider>
}

export const useMaxHeightContext = () => {
    const { maxHeight } = useContext(MaxHeightContext)
    return { maxHeight }
}
