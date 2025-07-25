import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { ComponentSizeType } from '@Shared/constants'
import { useMainContext } from '@Shared/Providers'

import { Button, ButtonComponentType, ButtonStyleType, ButtonVariantType } from '../Button'
import { PageHeader } from '../Header'
import { Icon } from '../Icon'

const getCurrentPathName = ({ pathname, search }: { pathname: string; search: string }) => `${pathname}${search}`

const additionalHeaderInfo = (url: string) => () => (
    <div className="ml-12">
        <Button
            dataTestId="open-in-new-tab"
            ariaLabel="Open in new tab"
            icon={<Icon name="ic-arrow-square-out" color={null} />}
            variant={ButtonVariantType.borderLess}
            style={ButtonStyleType.neutral}
            size={ComponentSizeType.xs}
            component={ButtonComponentType.anchor}
            anchorProps={{
                href: url,
            }}
        />
    </div>
)

export const TempAppWindow = () => {
    // HOOKS
    const { pathname, search } = useLocation()
    const { tempAppWindowConfig, setTempAppWindowConfig } = useMainContext()

    // REFS
    const currentPathName = useRef(getCurrentPathName({ pathname, search }))

    // HANDLERS
    const handleClose = () => {
        setTempAppWindowConfig({ open: false, title: null, url: null, component: null, image: null })
    }

    useEffect(() => {
        if (getCurrentPathName({ pathname, search }) !== currentPathName.current) {
            handleClose()
        }
    }, [pathname])

    if (!tempAppWindowConfig.open) {
        return null
    }

    const { title, url, image, showOpenInNewTab = false, component } = tempAppWindowConfig

    return (
        <div
            className="dc__position-abs dc__top-0 dc__right-0 dc__bottom-0 dc__left-0 flexbox-col bg__primary"
            style={{ zIndex: 'calc(var(--navigation-index) - 1)' }}
        >
            <PageHeader
                headerName={title}
                headerImage={image}
                additionalHeaderInfo={url && showOpenInNewTab ? additionalHeaderInfo(url) : null}
                onClose={handleClose}
            />
            {!!url && (
                <iframe
                    title="temp-app-window"
                    loading="lazy"
                    className="dc__no-border"
                    src={url}
                    width="100%"
                    height="100%"
                    allow="clipboard-read; clipboard-write; allow-scripts"
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            )}
            {component}
        </div>
    )
}
