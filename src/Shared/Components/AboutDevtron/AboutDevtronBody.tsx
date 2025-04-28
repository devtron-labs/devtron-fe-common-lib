import ReactGA from 'react-ga4'

import DevtronCopyright from '@Common/DevtronCopyright'
import { EULA_LINK, PRIVACY_POLICY_LINK, TERMS_OF_USE_LINK } from '@Shared/constants'
import { useMainContext } from '@Shared/Providers'

import { Button, ButtonComponentType, ButtonStyleType, ButtonVariantType } from '../Button'
import { InstallationType } from '../Header/types'
import { Icon } from '../Icon'

const AboutDevtronBody = () => {
    const { currentServerInfo } = useMainContext()

    const currentVersion = currentServerInfo?.serverInfo?.currentVersion
    const isEnterprise = currentServerInfo?.serverInfo?.installationType === InstallationType.ENTERPRISE

    const handleEULAClick = () => {
        ReactGA.event({
            category: 'about-devtron',
            action: 'ABOUT_DEVTRON_LICENSE_AGREEMENT_CLICKED',
        })
    }

    return (
        <div className="flexbox-col dc__align-items-center dc__gap-20">
            <div className="flex p-6 border__primary br-8">
                <Icon name="ic-devtron" color="B500" size={40} />
            </div>
            <div className="text-center">
                <p className="fs-16 cn-9 fw-6 lh-1-5 m-0">Devtron</p>
                <p className="fs-13 cn-7 fw-4 lh-20 m-0">{`${isEnterprise ? 'Enterprise' : 'OSS'} Version${currentVersion ? `(${currentVersion})` : ''}`}</p>
            </div>
            <DevtronCopyright />
            <div className="flexbox flex-wrap dc__content-center dc__gap-6">
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
