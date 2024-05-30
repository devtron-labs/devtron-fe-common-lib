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

import React from 'react'
import { DescriptionFieldProps } from '@rjsf/utils'

import { ReactComponent as Info } from '../../../Assets/Icon/ic-info-filled.svg'

export const Description = ({ id, description }: DescriptionFieldProps) =>
    description && (
        <div id={id} className="flex left flex-align-center mt-4 dc__gap-4">
            <Info className="icon-dim-16 mw-16 info-icon-n5" />
            <span className="cn-7 fs-11 fw-4 dc__ellipsis-right">{description}</span>
        </div>
    )
