import { FunctionComponent, ReactElement } from 'react'
import Tippy from '@tippyjs/react'
import { BUILD_INFRA_TEXT } from './constants'
import { FooterProps } from './types'
import { ConditionalWrap, Progressing } from '../../../Common'

const Footer: FunctionComponent<FooterProps> = ({ disabled, hideCancelButton, editProfile, loading }) => {
    const disableMessage = disabled
        ? BUILD_INFRA_TEXT.SUBMIT_BUTTON_TIPPY.INVALID_INPUT
        : BUILD_INFRA_TEXT.SUBMIT_BUTTON_TIPPY.REQUEST_IN_PROGRESS

    const getButtonText = () => {
        if (editProfile) {
            return BUILD_INFRA_TEXT.EDIT_SUBMIT
        }

        return BUILD_INFRA_TEXT.SAVE_SUBMIT
    }

    const renderTippy = (children: ReactElement) => (
        <Tippy content={disableMessage} placement="top" className="default-tt" arrow={false}>
            {children}
        </Tippy>
    )

    return (
        <div className="flex pl pr pb pt h-64 dc__gap-12 dc__border-top dc__content-start">
            <ConditionalWrap condition={disabled || loading} wrap={renderTippy}>
                <div className="flexbox dc__align-items-center">
                    <button type="submit" className="cta submit h-32 flex" disabled={disabled}>
                        {loading ? <Progressing size={16} /> : getButtonText()}
                    </button>
                </div>
            </ConditionalWrap>

            {!hideCancelButton && (
                <button type="button" className="cta cancel h-32 flex">
                    {BUILD_INFRA_TEXT.EDIT_CANCEL}
                </button>
            )}
        </div>
    )
}

export default Footer
