import { computePosition, flip, shift } from "@floating-ui/react"
import { ReactElement, useEffect, useRef, useState } from "react"
import "./FloatingMenu.css"

export interface FloatingMenuItem<T = unknown> {
    title: string
    subItems: {
        title: string
        value: T
        onSelect: (v: T) => void
    }[]
}

const FloatingMenu = <T, >({ children, items }: { children: ReactElement; items: FloatingMenuItem<T>[] }) => {
    const [open, setOpen] = useState<boolean>(false)
    const floatingElementRef = useRef<HTMLDivElement>(null)
    const refElement = useRef<HTMLInputElement>(null)

    // acomodar la lista flotante del dropdown
    useEffect(() => {
        if (!refElement.current || !floatingElementRef.current) {
            return
        }
        computePosition(refElement.current, floatingElementRef.current, {
            placement: "bottom-start",
            middleware: [flip(), shift()],
        }).then(({ x, y }) => {
            Object.assign((floatingElementRef as any).current.style, {
                top: `${y + 5}px`,
                left: `${x}px`,
                // width: `${refElement.current?.getBoundingClientRect().width || 0}px`,
            })
        })
    }, [open])

    function handleClickOutside(event: any): void {
        if (
            floatingElementRef.current &&
            !floatingElementRef.current.contains(event.target)
        ) {
            setOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <>
            <div ref={refElement} onClick={() => setOpen((v) => !v)}>
                {children}
            </div>
            {items.length > 0 && open && (
                <div className="floating-menu__list__container" ref={floatingElementRef}>
                    {items.map((item, index) => (
                        <div className="floating-menu__list__items" key={index}>
                            <span className="floating-menu__list__title">{item.title}</span>
                            {item.subItems.map((subItem, index) => (
                                <div
                                    key={`subitem-${index}`}
                                    className="floating-menu__list__item"
                                    onClick={() => {
                                        subItem.onSelect(subItem.value)
                                        setOpen(false)
                                    }}
                                >
                                    <span className="floating-menu__list__subtitle">{subItem.title}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default FloatingMenu
