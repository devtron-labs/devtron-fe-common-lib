import { ReactNode } from 'react'

export interface FilterChipProps {
    /**
     * Filter label
     */
    label: string
    /**
     * Corresponding value of the filter
     */
    value: unknown
    /**
     * Callback handler for removing the filter
     */
    handleRemoveFilter: (label: string, valueToRemove: unknown) => void
    /**
     * If passed, the label will be formatted accordingly
     */
    getFormattedLabel?: (filterKey: string) => ReactNode
    /**
     * If passed, the label will be formatted accordingly
     */
    getFormattedValue?: (filterKey: string, filterValue: unknown) => ReactNode
}

export interface FilterChipsProps<T = Record<string, unknown>>
    extends Pick<FilterChipProps, 'getFormattedLabel' | 'getFormattedValue'> {
    /**
     * Current filter configuration
     */
    filterConfig: T
    /**
     * Callback handler for removing the filters
     */
    clearFilters: () => void
    /**
     * Handler for removing a applied filter
     */
    onRemoveFilter: (filterConfig: T) => void
    /**
     * Class name for the container
     */
    className?: string
    /**
     * Class name for the clear filter button
     */
    clearButtonClassName?: string
}
