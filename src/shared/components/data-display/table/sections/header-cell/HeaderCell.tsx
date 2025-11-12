import React, { useRef, useState } from 'react'
import { TableHeaderColumn } from '../../table-items.interface'

import './HeaderCell.css'
import Icon from 'src/shared/icons';
import FilterMenu from '../FilterMenu/FilterMenu';
import { useEffectClickOutside } from 'src/shared/hooks';

const HeaderCell = ({ header, onSelectFilter }: { header: TableHeaderColumn, onSelectFilter?: (filter: string, fromHeader: string) => void }) => {

    const headerRef = useRef<any>(null)

    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffectClickOutside(headerRef, () => {
        if (headerRef && headerRef.current) {
            setIsOpen(false)
        }
    })

    return (header.filterMenu ?
        <th
            className="table__header__cell table__header__cell--pointer"
            ref={headerRef}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div style={{ display: "flex", justifyContent: 'space-between' }}>
                <span>{header.value}</span>
                <Icon
                    name={"chevronUp"} color="var(--dark-blueish-gray)"
                />
            </div>
            {
                isOpen ? <FilterMenu filters={header.filterMenu} onSelectFilter={(filter) => onSelectFilter?.(filter, header.value)} fromHeader={header.value} /> : null
            }
        </th>
        : <th className="table__header__cell">{header.value}</th>
    )
}

export default HeaderCell