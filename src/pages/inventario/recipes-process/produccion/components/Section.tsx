import { ReactNode } from "react"

type SectionProps = {
    title: string | ReactNode
    children: ReactNode
}

export default function Section({ title, children }: SectionProps): JSX.Element {
    return (
        <section className="produccion__section">
            <div className="produccion__section-header">
                {typeof title === "string" ? <p className="produccion__section-title">{title}</p> : title}
            </div>
            {children}
        </section>
    )
}
