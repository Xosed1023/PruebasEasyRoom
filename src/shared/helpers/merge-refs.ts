import { type MutableRefObject, type RefCallback } from "react"

type MutableRefList<T> = Array<RefCallback<T> | MutableRefObject<T> | undefined | null>

/**
 * Funcion utilizada para mezclar dos refs y mantenerlos sincronizados, util para componentes que fueron creados por forwardRef y además se quiere mantener una referencia internamente en el componente
 * @param refs 
 * @example <input ref={mergeRefs(refFromForwardRef, refFromUseRef)} />
 */
export function mergeRefs<T>(...refs: MutableRefList<T>): RefCallback<T> {
    return (val: T) => {
        setRef(val, ...refs)
    }
}

export function setRef<T>(val: T, ...refs: MutableRefList<T>): void {
    refs.forEach((ref) => {
        if (typeof ref === "function") {
            ref(val)
        } else if (ref !== null) {
            (ref as MutableRefObject<T>).current = val
        }
    })
}