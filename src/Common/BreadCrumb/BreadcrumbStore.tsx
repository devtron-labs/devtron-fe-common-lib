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

import React, { createContext, useState } from 'react'
import { BreadcrumbTextProps } from './Types'

const initialState = {
    alias: {},
}

export const BreadcrumbText = ({ heading, isActive, shouldTruncate = false }: BreadcrumbTextProps) => (
    <span className={`dc__breadcrumb-text cb-5 fs-16 lh-1-5 ${shouldTruncate ? 'dc__truncate' : ''} ${isActive ? 'cn-9 fw-6' : 'cb-5 fw-4 dc__mxw-155 dc__ellipsis-right'}`}>{heading}</span>
)

export const getBreadCrumbSeparator = (sep: string = '/') => (
    <span className="dc__devtron-breadcrumb__item__separator">{sep}</span>
)


const Store = ({ children }) => {
    const [state, setState] = useState(initialState)
    return <BreadcrumbContext.Provider value={{ state, setState }}>{children}</BreadcrumbContext.Provider>
}

export const BreadcrumbContext = createContext({
    state: { alias: {} },
    setState: null,
})

export function useBreadcrumbContext() {
    const context = React.useContext(BreadcrumbContext)
    if (!context) {
        throw new Error(`breadcrumb components cannot be used outside Breadcrumb context`)
    }
    return context
}

export default Store
