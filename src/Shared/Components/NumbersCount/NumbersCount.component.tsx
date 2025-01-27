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

import { ReactComponent as ICTilde } from '@Icons/ic-tilde.svg'
import { NumbersCountProps } from './types'

const NumbersCount = ({ count, isApprox, isSelected }: NumbersCountProps) => (
    <div
        className={`flex dc__no-shrink br-12 dc__gap-2 px-6 ${isSelected ? 'bcb-5 cn-0' : 'bcn-1 cn-7'} fs-13 fw-6 lh-20`}
    >
        {isApprox && <ICTilde className="dc__no-shrink icon-dim-12 scn-0" />}
        <span>{count}</span>
    </div>
)

export default NumbersCount
