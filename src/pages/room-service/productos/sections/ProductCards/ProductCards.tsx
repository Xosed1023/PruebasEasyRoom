import { forwardRef, ReactNode, Ref, useEffect, useImperativeHandle, useRef } from "react"

const ProductCards = forwardRef(
    ({ children, className, category }: { children: ReactNode, className?: string, category: string[] }, ref?: Ref<HTMLDivElement | null>) => {
        const cardsRef = useRef<HTMLDivElement>(null)

        useImperativeHandle(ref, () => cardsRef?.current)

        useEffect(() => {
            if (!cardsRef.current || !category) {
                return
            }
            cardsRef.current.scrollTop = 0
        }, [category])


        return (
            <div className="cards-container-wrapper">
                <div className={className} ref={cardsRef}>
                    {children}
                </div>
            </div>
        )
    }
)

export default ProductCards
