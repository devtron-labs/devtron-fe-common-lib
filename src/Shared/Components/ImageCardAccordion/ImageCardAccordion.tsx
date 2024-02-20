import { useState } from 'react'
import { CDModalTab, CDModalTabType } from '../../../Common'
import { Vulnerabilities } from '../Vulnerabilities'
import { AccordionItemProps, ImageCardAccordionProps } from './types'
import { ReactComponent as ICChevronDown } from '../../../Assets/Icon/ic-chevron-down.svg'

const AccordionItem = ({ currentTab, activeTab, setActiveTab, buttonText }: AccordionItemProps) => {
    const handleTabSwitch = () => {
        setActiveTab(currentTab)
    }

    return (
        <li className="tab-list__tab">
            <button
                type="button"
                onClick={handleTabSwitch}
                className={`dc__transparent tab-list__tab-link tab-list__tab-link--vulnerability ${
                    currentTab === activeTab ? 'active' : ''
                }`}
            >
                {buttonText}
            </button>
        </li>
    )
}

const ImageCardAccordion = ({
    isSecurityModuleInstalled,
    artifactId,
    applicationId,
    environmentId,
    changesCard,
    isScanned,
    isScanEnabled,
}: ImageCardAccordionProps) => {
    const [isOpened, setIsOpened] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<CDModalTabType>(CDModalTab.Changes)
    const [vulnerabilityCount, setVulnerabilityCount] = useState<number>(null)

    const handleAccordionToggle = () => {
        setIsOpened(!isOpened)
    }

    const renderCard = () => {
        if (!isOpened) {
            return null
        }

        if (activeTab === CDModalTab.Changes) {
            return changesCard
        }

        return (
            <Vulnerabilities
                isScanned={isScanned}
                isScanEnabled={isScanEnabled}
                artifactId={artifactId}
                applicationId={applicationId}
                environmentId={environmentId}
                setVulnerabilityCount={setVulnerabilityCount}
            />
        )
    }

    return (
        <>
            <ul className={`tab-list tab-list--vulnerability ${isOpened ? '' : 'tab-bottom-radius'}`}>
                {isOpened &&
                    (isSecurityModuleInstalled ? (
                        <>
                            <AccordionItem
                                currentTab={CDModalTab.Changes}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                buttonText="Changes"
                            />

                            <AccordionItem
                                currentTab={CDModalTab.Security}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                buttonText={`Security ${vulnerabilityCount ? `(${vulnerabilityCount})` : ''}`}
                            />
                        </>
                    ) : (
                        <div className="fs-13 fw-6 flex">Changes</div>
                    ))}
                <li className="flex dc__align-right">
                    <button
                        type="button"
                        className="material-history__changes-btn"
                        data-testid={isOpened ? 'collapse-show-info' : 'collapse-hide-info'}
                        onClick={handleAccordionToggle}
                    >
                        {isOpened ? 'Hide info' : 'Show more info'}

                        <ICChevronDown
                            className="icon-dim-24"
                            style={{ transform: `${isOpened ? 'rotate(-180deg)' : ''}` }}
                        />
                    </button>
                </li>
            </ul>

            {renderCard()}
        </>
    )
}

export default ImageCardAccordion
