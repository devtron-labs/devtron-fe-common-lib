import { ComponentSizeType } from '@Shared/constants'
import { StylesConfig } from 'react-select'
import { SelectPickerOptionType, SelectPickerProps, SelectPickerVariantType } from './type'

const getMenuWidthFromSize = (menuSize: SelectPickerProps['menuSize']): string => {
    switch (menuSize) {
        case ComponentSizeType.medium:
            return '125%'
        case ComponentSizeType.large:
            return '150%'
        case ComponentSizeType.small:
        default:
            return '100%'
    }
}

const getVariantOverrides = (variant: SelectPickerVariantType): StylesConfig<SelectPickerOptionType> => {
    switch (variant) {
        case SelectPickerVariantType.BORDER_LESS:
            return {
                menu: () => ({
                    width: '250px',
                }),
                control: () => ({
                    backgroundColor: 'var(--N0)',
                    border: 'none',
                    padding: 0,
                    gap: '2px',
                }),
                singleValue: () => ({
                    color: 'var(--B500)',
                    fontWeight: 600,
                }),
            }
        default:
            return null
    }
}

const getOptionBgColor = (state: Parameters<StylesConfig<SelectPickerOptionType>['option']>[1]): string => {
    if (state.isSelected && !state.selectProps.isMulti) {
        return 'var(--B100)'
    }

    if (state.isFocused) {
        return 'var(--N50)'
    }

    return 'var(--N0)'
}

export const getCommonSelectStyle = ({
    error,
    size,
    menuSize,
    variant,
    getIsOptionValid,
}: Pick<
    SelectPickerProps,
    'error' | 'size' | 'menuSize' | 'variant' | 'getIsOptionValid'
>): StylesConfig<SelectPickerOptionType> => ({
    container: (base, state) => ({
        ...base,
        ...(state.isDisabled && {
            cursor: 'not-allowed',
            pointerEvents: 'auto',
        }),
    }),
    menu: (base, state) => ({
        ...base,
        overflow: 'hidden',
        marginBlock: '4px',
        backgroundColor: 'var(--N0)',
        border: '1px solid var(--N200)',
        boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.20)',
        width: getMenuWidthFromSize(menuSize),
        zIndex: 'var(--select-picker-menu-index)',
        ...(getVariantOverrides(variant)?.menu(base, state) || {}),
    }),
    menuList: (base) => ({
        ...base,
        padding: 0,

        // Override the padding of the first group header
        '> div': {
            '> :first-child': {
                paddingTop: '0 !important',
            },
        },
    }),
    control: (base, state) => ({
        ...base,
        minHeight: size === ComponentSizeType.medium ? 'auto' : '36px',
        boxShadow: 'none',
        backgroundColor: 'var(--N50)',
        border: `1px solid ${error ? 'var(--R500)' : 'var(--N200)'}`,
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        padding: '5px 8px',
        gap: '8px',
        opacity: state.isDisabled ? 0.5 : 1,
        flexWrap: 'nowrap',
        maxHeight: '120px',
        overflow: 'auto',
        alignItems: 'safe center',
        ...(getVariantOverrides(variant)?.control(base, state) || {}),

        '&:hover': {
            borderColor: state.isDisabled ? 'var(--N200)' : 'var(--N300)',
        },
        '&:focus, &:focus-within': {
            borderColor: state.isDisabled ? 'var(--N200)' : 'var(--B500)',
            outline: 'none',
        },
    }),
    option: (base, state) => ({
        ...base,
        color: 'var(--N900)',
        backgroundColor: getOptionBgColor(state),
        padding: '6px 8px',
        cursor: 'pointer',
        fontSize: '13px',
        lineHeight: '20px',
        fontWeight: 400,

        ':active': {
            backgroundColor: 'var(--N100)',
        },

        ':hover': {
            backgroundColor: 'var(--N50)',
        },
    }),
    dropdownIndicator: (base, state) => ({
        ...base,
        color: 'var(--N600)',
        padding: '0',
        transition: 'all .2s ease',
        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    }),
    clearIndicator: (base) => ({
        ...base,
        padding: 0,

        '&:hover': {
            backgroundColor: 'transparent',
            color: 'inherit',

            'svg use': {
                fill: 'var(--R500)',
            },
        },
    }),
    valueContainer: (base, state) => ({
        ...base,
        padding: '0',
        fontWeight: '400',
        ...(state.selectProps.isMulti && {
            gap: '8px',
        }),
    }),
    multiValue: (base, state) => {
        const isOptionValid = getIsOptionValid(state.data)

        return {
            ...base,
            background: isOptionValid ? 'var(--N0)' : 'var(--R100)',
            border: isOptionValid ? '1px solid var(--N200)' : '1px solid var(--R200)',
            borderRadius: '4px',
            padding: '1px 5px',
            maxWidth: '250px',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
        }
    },
    multiValueLabel: (base) => ({
        ...base,
        borderRadius: 0,
        color: 'var(--N900)',
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '20px',
        padding: 0,
        paddingLeft: 0,
    }),
    multiValueRemove: (base) => ({
        ...base,
        padding: 0,
        borderRadius: 0,

        '&:hover': {
            backgroundColor: 'transparent',
            color: 'inherit',

            'svg use': {
                fill: 'var(--R500)',
            },
        },
    }),
    loadingMessage: (base) => ({
        ...base,
        color: 'var(--N600)',
    }),
    noOptionsMessage: (base) => ({
        ...base,
        color: 'var(--N600)',
    }),
    group: (base) => ({
        ...base,
        paddingTop: '4px',
        paddingBottom: 0,
    }),
    groupHeading: (base) => ({
        ...base,
        fontWeight: 600,
        fontSize: '12px',
        color: 'var(--N900)',
        backgroundColor: 'var(--N100)',
        marginBottom: 0,
        padding: '4px 8px',
        textTransform: 'none',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        position: 'sticky',
        top: 0,
        zIndex: 1,
    }),
    input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
        color: 'var(--N900)',
        size: '13px',
        fontWeight: 400,
        lineHeight: '20px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'clip',
    }),
    placeholder: (base) => ({
        ...base,
        color: 'var(--N500)',
        fontSize: '13px',
        lineHeight: '20px',
        fontWeight: 400,
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    }),
    indicatorsContainer: (base) => ({
        ...base,
        gap: '4px',
        flexShrink: 0,
    }),
    singleValue: (base, state) => ({
        ...base,
        margin: 0,
        color: 'var(--N900)',
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: '20px',
        ...(getVariantOverrides(variant)?.singleValue(base, state) || {}),
    }),
})
