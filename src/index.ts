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

import '@tanstack/react-query'

import { customEnv } from './Shared'

declare global {
    interface Window {
        __BASE_URL__: string
        __ORCHESTRATOR_ROOT__: string
        _env_: customEnv
    }
}

declare module '@tanstack/react-query' {
    export interface Register {
        queryMeta: {
            /**
             * Optional flag indicating whether to display a toast notification for errors.
             * @default true
             */
            showToastError?: boolean
        }
        mutationMeta: {
            /**
             * Optional flag indicating whether to display a toast notification for errors.
             * @default true
             */
            showToastError?: boolean
        }
    }
}

export * from './Common'
export * from './Pages'
export * from './Pages-Devtron-2.0'
export * from './Shared'
