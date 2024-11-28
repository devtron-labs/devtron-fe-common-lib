import { DynamicDataTableHeaderType, DynamicDataTableProps, DynamicDataTableRowDataType } from './types'

export const getActionButtonPosition = <K extends string>({
    headers,
    actionButtonConfig,
}: Pick<DynamicDataTableProps<K>, 'headers' | 'actionButtonConfig'>) =>
    headers.findIndex(({ key }) => actionButtonConfig?.key === key)

export const getHeaderGridTemplateColumn = <K extends string>(
    headers: DynamicDataTableHeaderType<K>[],
    actionButtonConfig: DynamicDataTableProps<K>['actionButtonConfig'],
    noDeleteBtn: boolean,
) => {
    const actionButtonIndex = getActionButtonPosition({ headers, actionButtonConfig })
    const actionButtonWidth = actionButtonConfig?.width || '33px'
    const isActionButtonAtTheStart = actionButtonIndex === 0 && actionButtonConfig.position !== 'end'
    const gridWidthRegex = /^\d+fr$/

    const columns = headers.map(({ width }, index) => {
        if (!isActionButtonAtTheStart && index === actionButtonIndex && !gridWidthRegex.test(width)) {
            return `calc(${width} + ${actionButtonWidth})`
        }
        if (!noDeleteBtn && index === headers.length - 1 && !gridWidthRegex.test(width)) {
            return `calc(${width} + 33px)`
        }
        return width
    })

    if (isActionButtonAtTheStart) {
        columns.unshift(actionButtonWidth)
    }

    return columns.join(' ').trim()
}

export const getRowGridTemplateColumn = <K extends string>(
    headers: DynamicDataTableHeaderType<K>[],
    actionButtonConfig: DynamicDataTableProps<K>['actionButtonConfig'],
    noDeleteBtn: boolean,
) => {
    const actionButtonIndex = getActionButtonPosition({ headers, actionButtonConfig })
    const actionButtonWidth = actionButtonConfig?.width || '32px'
    const actionButtonPosition = actionButtonConfig?.position

    const columns = headers.map(({ width }, index) => {
        if (index === actionButtonIndex) {
            return actionButtonPosition === 'end' ? `${width} ${actionButtonWidth}` : `${actionButtonWidth} ${width}`
        }
        return width
    })

    if (!noDeleteBtn) {
        columns.push('32px')
    }

    return columns.join(' ').trim()
}

export const rowTypeHasInputField = (type: DynamicDataTableRowDataType) => {
    const inputFieldTypes = [
        DynamicDataTableRowDataType.TEXT,
        DynamicDataTableRowDataType.SELECT_TEXT,
        DynamicDataTableRowDataType.DROPDOWN,
    ]

    return inputFieldTypes.includes(type || DynamicDataTableRowDataType.TEXT)
}
