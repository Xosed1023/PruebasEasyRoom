import React, { ReactNode } from "react"
import { Option, OptionWithId } from "../MultipleSelectDropdown"

import Icon from "src/shared/icons"

import ProfileDefault from "../../../../../assets/webp/profile_default.webp"

import "./DropdownItem.css"
import Checkbox from "../Checkbox/Checkbox"

interface ItemProps<T> extends Omit<Partial<HTMLDivElement>, 'id'>, Option<T> {
    id: string
    isSelected: boolean
    isDisabled: boolean
    itemClassName?: string
    boxClassName?: string
    onSelect(item: OptionWithId<T>)
    iconInOptions?: boolean
    subtitle?: string
    description?: string
    icon?: string
    precio?: ReactNode
}

const DropdownItem = <T, >({
    label,
    id,
    value,
    available,
    photoSrc,
    checked,
    withPhoto = false,
    isSelected,
    isDisabled,
    itemClassName,
    boxClassName,
    description,
    withCheckbox,
    onSelect,
    iconInOptions,
    subtitle,
    icon,
    precio,
}: ItemProps<T>) => {
    return (
        <div className={itemClassName}>
            {isSelected && (
                <div
                    className={`${boxClassName} check`}
                    tabIndex={0}
                    onClick={() => (!isDisabled ? onSelect({ label, value, available, photoSrc, checked, id }) : null)}
                >
                    <div className={`multiple-dropdown-component__item__box__main ${isDisabled ? "deseable" : ""}`}>
                        <div className="icon-ajust">
                            {withCheckbox && <Checkbox selected={isSelected} />}
                            {withPhoto ? (
                                <img src={photoSrc || ProfileDefault} className="dropdown-component__item__box__foto" />
                            ) : (
                                <></>
                            )}
                            {iconInOptions && icon ? (
                                <Icon name={icon} color="var(--header)" width={"16px"} height={"16px"} />
                            ) : null}
                            <p>
                                {precio ? precio : label}
                            </p>
                        </div>
                        {subtitle && <p className="multiple-dropdown-component__item__subtitle">{subtitle}</p>}
                        {description && <p className="multiple-dropdown-component__item__subtitle">{description}</p>}
                    </div>
                </div>
            )}
            {!isSelected && isDisabled && (
                <div className="multiple-dropdown-component__item__box__main deseable">
                    <div className={`${boxClassName}`} tabIndex={0}>
                        {withCheckbox && <Checkbox selected={isSelected} />}
                        {withPhoto ? (
                            <img src={photoSrc || ProfileDefault} className="dropdown-component__item__box__foto" />
                        ) : (
                            <></>
                        )}
                        {iconInOptions && icon ? (
                            <Icon name={icon} color="var(--header)" width={"16px"} height={"16px"} />
                        ) : null}
                        <p>
                            {precio ? precio : label}
                        </p>
                    </div>
                    {subtitle && (
                        <p
                            className="multiple-dropdown-component__item__subtitle"
                            style={{ marginLeft: "42px", marginTop: "-5px" }}
                        >
                            {subtitle}
                        </p>
                    )}
                    {description && (
                        <p
                            className="multiple-dropdown-component__item__subtitle"
                            style={{ marginLeft: "42px", marginTop: "-5px" }}
                        >
                            {description}
                        </p>
                    )}
                </div>
            )}
            {!isSelected && !isDisabled && (
                <div
                    className="multiple-dropdown-component__item__box__main"
                    onClick={() => onSelect({ label, value, available, photoSrc, checked, id })}
                >
                    <div
                        className={boxClassName}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onSelect({ label, value, available, photoSrc, checked, id })
                            }
                        }}
                        tabIndex={0}
                    >
                        {withCheckbox && <Checkbox selected={isSelected} />}
                        {withPhoto ? (
                            <img src={photoSrc || ProfileDefault} className="dropdown-component__item__box__foto" />
                        ) : (
                            <></>
                        )}
                        {iconInOptions && icon ? (
                            <Icon name={icon} color="var(--header)" width={"16px"} height={"16px"} />
                        ) : null}
                        <p>
                            {precio ? precio : label}
                        </p>
                    </div>
                    {subtitle && (
                        <p
                            className="multiple-dropdown-component__item__subtitle"
                            style={{ marginLeft: "42px", marginTop: "-5px" }}
                        >
                            {subtitle}
                        </p>
                    )}
                    {description && (
                        <p
                            className="multiple-dropdown-component__item__subtitle"
                            style={{ marginLeft: "42px", marginTop: "-5px" }}
                        >
                            {description}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export default DropdownItem
