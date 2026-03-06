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

import {
    QueryKey,
    useInfiniteQuery as rqUseInfiniteQuery,
    UseInfiniteQueryOptions,
    UseInfiniteQueryResult,
    useMutation as rqUseMutation,
    UseMutationOptions,
    UseMutationResult,
    useQuery as rqUseQuery,
    useQueryClient,
    UseQueryOptions,
    UseQueryResult,
} from '@tanstack/react-query'

import { ServerErrors } from '@Common/ServerError'
import { ResponseType } from '@Common/Types'

export const useQuery = <
    TQueryFnData = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    WrapWithResponseType extends boolean = true,
>(
    options: UseQueryOptions<
        WrapWithResponseType extends true ? ResponseType<TQueryFnData> : TQueryFnData,
        ServerErrors,
        TData,
        TQueryKey
    >,
): UseQueryResult<TData, ServerErrors> => rqUseQuery(options)

export const useMutation = <TData = unknown, TVariables = void, TContext = unknown>(
    options: UseMutationOptions<TData, ServerErrors, TVariables, TContext>,
): UseMutationResult<TData, ServerErrors, TVariables, TContext> => rqUseMutation(options)

export const useInfiniteQuery = <
    TQueryFnData = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    WrapWithResponseType extends boolean = true,
>(
    options: UseInfiniteQueryOptions<
        WrapWithResponseType extends true ? ResponseType<TQueryFnData> : TQueryFnData,
        ServerErrors,
        TData,
        WrapWithResponseType extends true ? ResponseType<TQueryFnData> : TQueryFnData,
        TQueryKey
    >,
): UseInfiniteQueryResult<TData, ServerErrors> => rqUseInfiniteQuery(options)

export { useQueryClient }
