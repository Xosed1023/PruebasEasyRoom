import React from 'react'
import { FilterMenuItem } from '../../table-items.interface'
import { v4 as uuid } from 'uuid';

import './FilterMenu.css'

const FilterMenu = ({ filters, onSelectFilter, fromHeader }: { filters: FilterMenuItem[], onSelectFilter?: (filter: string, fromHeader: string) => void, fromHeader: string }) => {
    return (
        <div className='table__filter-menu__wrapper'>
            <div className="table__filter-menu">
                {
                    filters.map((filter, index) =>
                        <div className="table__filter-menu__item" key={uuid()} onClick={() => onSelectFilter?.(filter.value, fromHeader)}>
                            <span className='table__filter-menu__text'>{filter.valueToDisplay}</span>
                            {
                                index < filters.length - 1 ?
                                    <div className='table__filter-menu__divider'></div> : null
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default FilterMenu