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

import { ReactComponent as ICWarningY5 } from '@Icons/ic-warning-y5.svg'

const UnsavedChanges = () => (
    <div className="flexbox dc__align-item-center dc__gap-6">
        <ICWarningY5 className="icon-dim-20 dc__no-shrink" />
        <span className="cn-9 fs-13 fw-4 lh-20">Unsaved changes</span>
    </div>
)

export default UnsavedChanges
