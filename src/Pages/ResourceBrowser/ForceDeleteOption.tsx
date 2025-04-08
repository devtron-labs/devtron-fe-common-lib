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

import { Checkbox } from '@Common/Checkbox'
import { CHECKBOX_VALUE } from '@Common/Types'

import { AdditionalConfirmationModalOptionsProps } from './types'

const ForceDeleteOption = ({
    optionsData,
    setOptionsData: setShouldForceDelete,
    children,
}: AdditionalConfirmationModalOptionsProps<boolean>) => {
    const shouldForceDelete = optionsData ?? false

    const handleToggleShouldForceDelete = () => {
        setShouldForceDelete(!shouldForceDelete)
    }

    return (
        <div className="flexbox-col dc__gap-12 w-100">
            <Checkbox
                value={CHECKBOX_VALUE.CHECKED}
                isChecked={shouldForceDelete}
                dataTestId="force-delete-resource"
                rootClassName="m-0"
                onChange={handleToggleShouldForceDelete}
            >
                Force delete resource
            </Checkbox>

            {children}
        </div>
    )
}

export default ForceDeleteOption
