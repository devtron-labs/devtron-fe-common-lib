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

import GettingToast from '../../../Assets/Img/lifebuoy.png'
import { LOGIN_COUNT, MAX_LOGIN_COUNT, POSTHOG_EVENT_ONBOARDING, stopPropagation } from '../../../Common'
import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { handlePostHogEventUpdate, setActionWithExpiry } from '../Header/utils'
import updateLoginCount from './service'
import { GettingStartedType } from './types'

const GettingStartedCard = ({ hideGettingStartedCard }: GettingStartedType) => {
    const onClickedOkay = async () => {
        setActionWithExpiry('clickedOkay', 1)
        hideGettingStartedCard()
        await handlePostHogEventUpdate(POSTHOG_EVENT_ONBOARDING.TOOLTIP_OKAY)
    }

    const onClickedDontShowAgain = async () => {
        const updatedPayload = {
            key: LOGIN_COUNT,
            value: `${MAX_LOGIN_COUNT}`,
        }
        await updateLoginCount(updatedPayload)
        hideGettingStartedCard(updatedPayload.value)
        await handlePostHogEventUpdate(POSTHOG_EVENT_ONBOARDING.TOOLTIP_DONT_SHOW_AGAIN)
    }

    return (
        <div className="cn-0 p-20 br-8 fs-13 bg__overlay--primary dc__border w-300" onClick={stopPropagation}>
            <img className="mb-12 icon-dim-32" src={GettingToast} alt="getting started icon" />
            <div className="flex column left fw-6 cn-7">Getting started</div>
            <div className="cn-7">You can always access the Getting Started guide from here.</div>
            <div className="mt-12 lh-18 flex left dc__gap-12">
                <Button
                    text="Okay"
                    size={ComponentSizeType.xs}
                    dataTestId="getting-started-okay"
                    onClick={onClickedOkay}
                />
                <Button
                    text="Don't show again"
                    size={ComponentSizeType.xs}
                    dataTestId="getting-started-don't-show-again"
                    onClick={onClickedDontShowAgain}
                    style={ButtonStyleType.neutral}
                    variant={ButtonVariantType.secondary}
                />
            </div>
        </div>
    )
}

export default GettingStartedCard
