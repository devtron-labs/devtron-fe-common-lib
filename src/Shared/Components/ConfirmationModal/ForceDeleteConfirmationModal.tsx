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

import { ConfirmationModal, ConfirmationModalVariantType } from '@Shared/Components'
import { ForceDeleteConfirmationProps } from './types'

export const ForceDeleteConfirmationModal = ({
    title,
    subtitle,
    onDelete,
    closeConfirmationModal,
}: ForceDeleteConfirmationProps) => {
    const renderSubtitle = () => (
        <>
            <p className="p-8 dc__break-word bg__tertiary mxh-200 dc__overflow-auto br-4 m-0">Error: {subtitle}</p>
            <p className="m-0">Do you want to force delete?</p>
        </>
    )
    return (
        <ConfirmationModal
            variant={ConfirmationModalVariantType.delete}
            title={title}
            subtitle={renderSubtitle()}
            buttonConfig={{
                secondaryButtonConfig: {
                    text: 'Cancel',
                    onClick: closeConfirmationModal,
                },
                primaryButtonConfig: {
                    text: 'Force Delete',
                    onClick: onDelete,
                },
            }}
            handleClose={closeConfirmationModal}
        />
    )
}
