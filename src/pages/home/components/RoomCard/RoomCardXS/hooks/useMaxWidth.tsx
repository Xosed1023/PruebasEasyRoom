import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

const MaxWidthContext = createContext<{
    maxWidth: string
}>({ maxWidth: "" })

export const MaxWidthProvider = ({ children }: { children: ReactNode }) => {
    const { roomsDimensions } = useSelector((state: RootState) => state.rooms)
    const [maxWidth, setmaxWidth] = useState("")
    const handleNamesResize = () => {
        setmaxWidth(`calc(calc(95vw - 200px) / ${roomsDimensions?.y})`)
    }
    useEffect(() => {
        handleNamesResize();
        window.addEventListener("resize", handleNamesResize)
        return () => {
            window.removeEventListener("resize", handleNamesResize)
        }
    }, [])

    return <MaxWidthContext.Provider value={{ maxWidth }}>{children}</MaxWidthContext.Provider>
}

export const useMaxWidthContext = () => {
    const { maxWidth } = useContext(MaxWidthContext)
    return { maxWidth }
}
