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

import ReactGA from 'react-ga4'

import DevtronCopyright from '@Common/DevtronCopyright'
import { EULA_LINK, PRIVACY_POLICY_LINK, TERMS_OF_USE_LINK } from '@Shared/constants'
import { useMainContext } from '@Shared/Providers'

import { Button, ButtonComponentType, ButtonStyleType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'

const AboutDevtronBody = () => {
    const { currentServerInfo, isEnterprise, isFELibAvailable } = useMainContext()

    const currentVersion = currentServerInfo?.serverInfo?.currentVersion

    const isVersionCompatible = isFELibAvailable === isEnterprise

    const handleEULAClick = () => {
        ReactGA.event({
            category: 'about-devtron',
            action: 'ABOUT_DEVTRON_LICENSE_AGREEMENT_CLICKED',
        })
    }

    return (
        <div className="flexbox-col p-32 dc__gap-24 br-16 border__secondary bg__secondary">
            <div className="flexbox-col dc__align-items-center dc__gap-16 text-center">
                <div className="flex p-6 border__primary br-8">
                    <Icon name="ic-devtron" color="B500" size={40} />
                </div>
                <div>
                    <p className="fs-16 cn-9 fw-6 lh-1-5 m-0">Devtron</p>
                    {isVersionCompatible && (
                        <p className="fs-13 cn-7 fw-4 lh-20 m-0">{`${isEnterprise ? 'Enterprise' : 'OSS'} Version${currentVersion ? `(${currentVersion})` : ''}`}</p>
                    )}
                </div>
                <DevtronCopyright />
            </div>
            <div className="flexbox flex-wrap dc__content-center dc__gap-4">
                <Button
                    dataTestId="terms-of-service"
                    text="Terms of service"
                    variant={ButtonVariantType.text}
                    style={ButtonStyleType.neutral}
                    component={ButtonComponentType.anchor}
                    anchorProps={{
                        href: TERMS_OF_USE_LINK,
                    }}
                />
                <span>•</span>
                <Button
                    dataTestId="privacy-policy"
                    text="Privacy policy"
                    variant={ButtonVariantType.text}
                    style={ButtonStyleType.neutral}
                    component={ButtonComponentType.anchor}
                    anchorProps={{
                        href: PRIVACY_POLICY_LINK,
                    }}
                />
                <span>•</span>
                <Button
                    dataTestId="license-agreement"
                    text="End-User License agreement"
                    variant={ButtonVariantType.text}
                    style={ButtonStyleType.neutral}
                    onClick={handleEULAClick}
                    component={ButtonComponentType.anchor}
                    anchorProps={{
                        href: EULA_LINK,
                    }}
                />
            </div>
        </div>
    )
}

export default AboutDevtronBody
