import { useState } from 'react'
import { InfoColourBar } from '../../Common'
import { ReactComponent as MegaphoneIcon } from '../../Assets/Icon/ic-megaphone.svg'
import { ReactComponent as Close } from '../../Assets/Icon/ic-close.svg'
import { setActionWithExpiry, getDateInMilliseconds } from './header/utils'

interface AnnouncementBannerType {
    parentClassName?: string
    isCDMaterial?: boolean
}

const AnnouncementBanner = ({ parentClassName = '', isCDMaterial = false }: AnnouncementBannerType) => {
    const message = window?._env_?.ANNOUNCEMENT_BANNER_MSG
    const showAnnouncementBanner = (): boolean => {
        const expiryDateOfHidingAnnouncementBanner: string =
            typeof Storage !== 'undefined' &&
            localStorage.getItem(
                // it will store date and time of next day i.e, it will hide banner until this date
                'expiryDateOfHidingAnnouncementBanner',
            )
        const showAnnouncementBannerNextDay: boolean =
            typeof Storage !== 'undefined' &&
            getDateInMilliseconds(localStorage.getItem('dashboardLoginTime')) >
                getDateInMilliseconds(expiryDateOfHidingAnnouncementBanner)

        if (showAnnouncementBannerNextDay && !expiryDateOfHidingAnnouncementBanner) {
            return true
        }

        return getDateInMilliseconds(new Date().valueOf()) > getDateInMilliseconds(expiryDateOfHidingAnnouncementBanner)
    }

    const [showAnouncementBanner, setshowAnouncementBanner] = useState(message ? showAnnouncementBanner() : false)

    if (!message) {
        return null
    }

    const onClickCloseAnnouncememtBanner = () => {
        setshowAnouncementBanner(false)
        if (typeof Storage !== 'undefined') {
            setActionWithExpiry('expiryDateOfHidingAnnouncementBanner', 1)
        }
    }

    const renderAnnouncementBanner = () => (
        <div className="flex">
            <div>{message}</div>
            {isCDMaterial ? null : (
                <Close className="icon-dim-20 ml-8 fcn-9" onClick={onClickCloseAnnouncememtBanner} />
            )}
        </div>
    )

    return showAnouncementBanner || isCDMaterial ? (
        <div className={`announcement-banner-container ${parentClassName}`}>
            <InfoColourBar
                message={renderAnnouncementBanner()}
                classname="announcement-bar fw-6 lh-20"
                Icon={MegaphoneIcon}
                iconSize={20}
            />
        </div>
    ) : null
}

export default AnnouncementBanner
