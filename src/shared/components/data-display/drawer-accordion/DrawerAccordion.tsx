import React, { useState } from "react"
import Icon from "src/shared/icons"
import { COLLECTION } from "src/shared/icons/Icon"
import Empty from "../empty/Empty"

interface AccordionProps {
    title: string
    children?: React.ReactNode
    emptyIcon: keyof typeof COLLECTION | (string & {})
    emptyDescription: string
    isEmpty?: boolean
    className?: string
}

import "./DrawerAccordion.css"

const Accordion: React.FC<AccordionProps> = ({
    title,
    children,
    isEmpty = true,
    emptyDescription,
    emptyIcon,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleAccordion = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className={`drawer-accordion${className ? ` ${className}` : ""}`}>
            <div className="drawer-accordion-header" onClick={toggleAccordion}>
                <div className="drawer-accordion-title">{title}</div>
                <div className={`drawer-accordion-icon ${isOpen ? "open" : ""}`}>
                    <Icon name={"chevronUp"} color="var(--white)" height={24} width={24} />
                </div>
            </div>
            {!isEmpty ? (
                <div
                    className={`drawer-accordion-content-container ${isOpen ? "open" : ""}`}
                    style={{
                        maxHeight: isOpen ? "1000px" : "0",
                        overflow: "hidden",
                        transition: "max-height 0.3s ease-in-out",
                    }}
                >
                    <div className="drawer-accordion-content">{children}</div>
                </div>
            ) : (
                <div
                    className={`drawer-accordion-empty__container ${isOpen ? "open" : ""}`}
                    style={{
                        maxHeight: isOpen ? "1000px" : "0",
                        overflow: "hidden",
                        transition: "max-height 0.3s ease-in-out",
                    }}
                >
                    <Empty title={emptyDescription} theme="dark" icon={emptyIcon} />
                </div>
            )}
        </div>
    )
}

export default Accordion
