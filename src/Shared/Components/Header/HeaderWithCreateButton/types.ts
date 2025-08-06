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

import { ActionMenuProps } from '@Shared/Components/ActionMenu'

import { PageHeaderType } from '../types'

export interface HeaderWithCreateButtonProps {
    headerName: string
    additionalHeaderInfo: PageHeaderType['additionalHeaderInfo']
}

export enum CreateActionMenuItems {
    CUSTOM_APP = 'create-custom-app',
    CHART_STORE = 'create-from-chart-store',
    JOB = 'create-job',
}

export type CreateActionMenuProps = ActionMenuProps<CreateActionMenuItems>
