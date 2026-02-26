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

import { PropsWithChildren } from 'react'
import {
    MutationCache,
    QueryCache,
    QueryClient,
    QueryClientProvider as RQQueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { showError } from '@Common/Helper'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 0,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
            meta: { showToastError: true },
        },
        mutations: {
            gcTime: 0,
            retry: false,
            meta: { showToastError: true },
        },
    },
    queryCache: new QueryCache({
        onError: (error, query) => {
            if (query.meta.showToastError) {
                showError(error)
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error, _variables, _context, mutation) => {
            if (mutation.meta.showToastError) {
                showError(error)
            }
        },
    }),
})

export const QueryClientProvider = ({ children }: PropsWithChildren<{}>) => (
    <RQQueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        {children}
    </RQQueryClientProvider>
)
