import { DynamicDataTableHeaderType, DynamicDataTableProps } from './types'

export const getActionButtonPosition = <K extends string>({
    headers,
    actionButtonConfig,
}: Pick<DynamicDataTableProps<K>, 'headers' | 'actionButtonConfig'>) =>
    headers.findIndex(({ key }) => actionButtonConfig?.key === key)

export const getHeaderGridTemplateColumn = <K extends string>(
    headers: DynamicDataTableHeaderType<K>[],
    actionButtonConfig: DynamicDataTableProps<K>['actionButtonConfig'],
) => {
    const actionButtonIndex = getActionButtonPosition({ headers, actionButtonConfig })
    const actionButtonWidth = actionButtonConfig?.width || '32px'
    const isActionButtonAtTheStart = actionButtonIndex === 0 && actionButtonConfig.position !== 'end'

    const columns = headers.map(({ width }, index) => {
        if (!isActionButtonAtTheStart && index === actionButtonIndex) {
            if (!width.match(/^\d+fr$/)) {
                return `calc(${width} + ${actionButtonWidth})`
            }
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
    readOnly: boolean,
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

    if (!readOnly) {
        columns.push('32px')
    }

    return columns.join(' ').trim()
}
