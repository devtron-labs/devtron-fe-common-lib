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

import { ComponentSizeType } from '@Shared/constants'

import { Backdrop } from '../Backdrop'
import { Button } from '../Button'
import AboutDevtronBody from './AboutDevtronBody'

const AboutDevtronDialog = ({ handleCloseLicenseInfoDialog }: { handleCloseLicenseInfoDialog: () => void }) => (
    <Backdrop onEscape={handleCloseLicenseInfoDialog}>
        <div className="flexbox-col w-400 br-12 bg__primary border__primary dc__m-auto mt-40">
            <div className="p-24">
                <AboutDevtronBody />
            </div>
            <div className="flex px-24 py-20 dc__content-end">
                <Button
                    dataTestId="license-info-okay"
                    text="Okay"
                    size={ComponentSizeType.medium}
                    onClick={handleCloseLicenseInfoDialog}
                />
            </div>
        </div>
    </Backdrop>
)

export default AboutDevtronDialog
