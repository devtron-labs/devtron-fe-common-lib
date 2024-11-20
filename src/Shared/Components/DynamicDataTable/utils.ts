import { DynamicDataTableHeaderType } from './types'

export const getHeaderGridTemplateColumn = <K extends string>(headers: DynamicDataTableHeaderType<K>[]) =>
    headers.reduce((acc, { width }) => `${acc} ${width}`, '').trim()

export const getRowGridTemplateColumn = <K extends string>(
    headers: DynamicDataTableHeaderType<K>[],
    actionButtonWidth: string,
    readOnly: boolean,
) =>
    `${headers.reduce((acc, { width }) => `${acc} ${width}`, '').trim()} ${actionButtonWidth} ${!readOnly ? '32px' : ''}`
