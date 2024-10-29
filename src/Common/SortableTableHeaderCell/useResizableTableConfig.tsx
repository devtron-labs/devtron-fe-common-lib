import { useEffect, useState } from 'react'
import { UseResizableTableConfigProps } from './types'

const useResizableTableConfig = ({ headersConfig }: UseResizableTableConfigProps) => {
    const [headerDimensionsConfig, setHeaderDimensionsConfig] = useState<
        UseResizableTableConfigProps['headersConfig'][number]['width'][]
    >([])

    useEffect(() => {
        setHeaderDimensionsConfig(headersConfig.map((config) => config.width))
    }, [JSON.stringify(headersConfig)])

    const handleResize = (
        headerCellId: UseResizableTableConfigProps['headersConfig'][number]['id'],
        deltaChange: number,
    ) => {
        const headerCellIndexInConfig = headersConfig.findIndex((config) => config.id === headerCellId)

        if (headerCellIndexInConfig < 0) {
            return
        }

        setHeaderDimensionsConfig((prev) => {
            const updatedHeaderDimensionsConfig = structuredClone(prev)
            // Only numbers are supported for v1
            if (typeof updatedHeaderDimensionsConfig[headerCellIndexInConfig] !== 'number') {
                return prev
            }

            const updatedCellDimension = updatedHeaderDimensionsConfig[headerCellIndexInConfig] + deltaChange
            const currentHeaderCellConfig = headersConfig[headerCellIndexInConfig]

            if (
                updatedCellDimension < (currentHeaderCellConfig.minWidth ?? 70) ||
                updatedCellDimension > (currentHeaderCellConfig.maxWidth ?? 600)
            ) {
                return prev
            }

            updatedHeaderDimensionsConfig[headerCellIndexInConfig] = updatedCellDimension
            return updatedHeaderDimensionsConfig
        })
    }

    const register = (headerCellId: UseResizableTableConfigProps['headersConfig'][number]['id']) => {
        const sortableTableHeaderCellConfig = headersConfig.find((config) => config.id === headerCellId)

        if (!sortableTableHeaderCellConfig) {
            return null
        }

        return {
            id: sortableTableHeaderCellConfig.id,
        }
    }

    return {
        gridTemplateColumns: headerDimensionsConfig
            .map((config) => (typeof config === 'number' ? `${config}px` : config))
            .join(' '),
        handleResize,
        register,
    }
}

export default useResizableTableConfig
