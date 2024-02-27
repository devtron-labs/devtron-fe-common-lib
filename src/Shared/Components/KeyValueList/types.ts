export enum KeyValueListActionType {
    ADD = 'ADD_KEY_VALUE',
    DELETE = 'DELETE_KEY_VALUE',
    UPDATE_KEY = 'UPDATE',
    UPDATE_VALUE = 'UPDATE_VALUE',
}

export type KeyValueListType = {
    key: string
    value: string
}

export interface KeyValueHandlerDataType {
    /**
     * Used to identify the key-value pair.
     * Optional - only for ADD action else it is mandatory
     */
    index?: number
    value?: string
}

export interface HandleKeyValueChangeType {
    action: KeyValueListActionType
    data?: KeyValueHandlerDataType
}

export interface KeyValueListProps {
    keyValueList: KeyValueListType[]
    handleKeyValueChange: ({ action, data }: HandleKeyValueChangeType) => void
    /**
     * Would disable adding/deleting/updating parameters
     */
    isDisabled?: boolean
    disabledInfo?: string
    /**
     * @default - Add Parameter
     */
    addButtonText?: string
    /**
     * @default - Enter Key
     */
    keyPlaceholder?: string
    /**
     * @default - Enter Value
     */
    valuePlaceholder?: string
    /**
     * to be applied on each item
     */
    itemClassName?: string
}

export interface KeyValueItemProps extends Omit<KeyValueListProps, 'addButtonText' | 'keyValueList' | 'disabledInfo'> {
    itemKey: string
    itemValue: string
    index: number
}
