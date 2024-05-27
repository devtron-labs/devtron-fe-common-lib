import { components } from 'react-select'
import { multiSelectStyles } from '../../../../Common/MultiSelectCustomization'

export const dropdownStyles = {
    ...multiSelectStyles,
    menu: (base) => ({ ...base, zIndex: 9999, textAlign: 'left', width: '150%' }),
    control: (base) => ({
        ...base,
        backgroundColor: 'transparent',
        minHeight: '12px',
        cursor: 'pointer',
        border: 0,
        outline: 'none',
        boxShadow: 'none',
        fontSize: '13px',
    }),
    singleValue: (base) => ({
        ...base,
        fontWeight: 600,
        color: '#06c',
        marginLeft: 0,
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? 'var(--N100)' : 'white',
        color: 'var(--N900)',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        padding: '0 4px',
    }),
    valueContainer: (base) => ({
        ...base,
        height: '20px',
        padding: 0,
    }),
    indicatorsContainer: (base) => ({
        ...base,
        padding: 0,
    }),
    dropdownIndicator: (styles) => ({ ...styles, padding: 0 }),
}

export const Option = (props: any) => {
    const {
        isSelected,
        data: { status, author, runSource, renderRunSource, resourceId },
        label,
    } = props
    return (
        <components.Option {...props}>
            <div className={`flex left pt-8 pb-8 pl-8 pr-8 ${isSelected ? 'bcb-1' : ''}`}>
                <div
                    className={`flexbox dc__align-items-start dc__app-summary__icon icon-dim-22 ${status
                        .toLocaleLowerCase()
                        .replace(/\s+/g, '')} mr-8`}
                />
                <div className="flexbox-col dc__gap-8">
                    <div>
                        <div className="cn-9 fs-13"> {label}</div>
                        <div className="cn-7 flex left">
                            <span className="dc__capitalize">Deploy</span>&nbsp;
                            <div className="dc__bullet ml-4 dc__bullet--d2 mr-4" />
                            &nbsp;
                            {author === 'system' ? 'auto-triggered' : author}
                        </div>
                    </div>
                    {runSource && renderRunSource && renderRunSource(runSource, resourceId === runSource.id)}
                </div>
            </div>
        </components.Option>
    )
}
