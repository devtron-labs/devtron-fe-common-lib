/*
 * Copyright (c) 2024. Devtron Inc.
 */

import { useMemo } from 'react'

import emptyList from '@Images/empty-create.png'
import ErrorScreenManager from '@Common/ErrorScreenManager'
import { GenericEmptyState, GenericFilterEmptyState } from '@Common/index'

import GenericInfoCard from './GenericInfoCard.component'
import { GenericInfoListSkeleton } from './GenericInfoListSkeleton'
import { GenericInfoCardListingProps } from './types'

export const GenericInfoCardListing = ({
    isLoading,
    error,
    list,
    searchKey,
    reloadList,
    borderVariant,
    handleClearFilters,
    emptyStateConfig,
}: GenericInfoCardListingProps) => {
    const filteredList = useMemo(() => {
        const sanitizedList = list || []
        if (!searchKey || error) {
            return sanitizedList
        }

        const loweredSearchKey = searchKey.toLowerCase()
        return sanitizedList.filter(({ title }) => title.toLowerCase().includes(loweredSearchKey))
    }, [searchKey, list, error])

    if (isLoading) {
        return <GenericInfoListSkeleton borderVariant={borderVariant} />
    }

    if (error) {
        return <ErrorScreenManager code={error?.code as number} reload={reloadList} />
    }

    if (filteredList.length === 0) {
        if (searchKey) {
            return <GenericFilterEmptyState handleClearFilters={handleClearFilters} />
        }

        return (
            <GenericEmptyState
                image={emptyStateConfig.image ?? emptyList}
                renderButton={emptyStateConfig.renderButton}
                isButtonAvailable={!!emptyStateConfig.renderButton}
                {...emptyStateConfig}
            />
        )
    }

    return (
        <>
            {filteredList.map(({ id, title, description, author, Icon, onClick, linkProps }) => (
                <GenericInfoCard
                    key={id}
                    title={title}
                    description={description}
                    author={author}
                    borderVariant={borderVariant}
                    Icon={Icon}
                    {...(onClick ? { onClick } : { linkProps })}
                />
            ))}
        </>
    )
}
