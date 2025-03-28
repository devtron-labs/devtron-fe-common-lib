import { cloneElement } from 'react'
import { useStateFilters } from '@Common/Hooks'
import { FiltersTypeEnum, FilterWrapperProps } from './types'

const UseStateFilterWrapper = ({ children, additionalFilterProps }: FilterWrapperProps<FiltersTypeEnum.STATE>) => {
    const filterData = useStateFilters<string>(additionalFilterProps)

    return cloneElement(children, { ...children.props, filterData })
}

export default UseStateFilterWrapper
