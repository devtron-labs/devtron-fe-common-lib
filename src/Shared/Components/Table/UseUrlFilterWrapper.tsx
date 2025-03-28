import { cloneElement } from 'react'
import { useUrlFilters } from '@Common/Hooks'
import { FiltersTypeEnum, FilterWrapperProps } from './types'

const UseUrlFilterWrapper = ({ children, additionalFilterProps }: FilterWrapperProps<FiltersTypeEnum.URL>) => {
    const filterData = useUrlFilters<string, unknown>(additionalFilterProps)

    return cloneElement(children, { ...children.props, filterData })
}

export default UseUrlFilterWrapper
