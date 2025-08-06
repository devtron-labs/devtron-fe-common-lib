/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
