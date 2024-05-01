import { useState } from 'react'
import { ReactComponent as ICDropdown } from '../../../Assets/Icon/ic-chevron-down.svg'
import { PopupMenu } from '../../../Common'
import { ButtonWithSelectorProps } from './types'
import './buttonWithSelector.scss'

/**
 * Button With Selector
 * @param content Content to show in button
 * @param onClick Handler Function for button click
 * @param children Dropdown Content
 * @param className Other Classes to be applied
 *
 * @example
 * ```tsx
 * <ButtonWithSelector content='Create Job' onClick={() => {}} className=''>
 *  {dropdownOptions}
 * </ButtonWithSelector>
 * ```
 */
const ButtonWithSelector = ({
    content,
    onClick,
    children,
    className = '',
    popUpBodyClassName = '',
    showPopUp = true,
}: ButtonWithSelectorProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    return (
        <div className="flexbox">
            <button
                className={`cta flex h-28 ${showPopUp ? 'dc__no-right-radius' : ''} dc__no-border-imp fs-12 fw-6 lh-20-imp ${className}`}
                type="button"
                onClick={onClick}
            >
                {content}
            </button>
            {showPopUp && (
                <PopupMenu autoClose autoPosition onToggleCallback={setIsMenuOpen}>
                    <PopupMenu.Button rootClassName="flex dc__transparent p-8 w-28 bcb-5 dc__right-radius-4 dc__no-left-radius dc__no-top-border dc__no-bottom-border dc__no-right-border button-with-selector">
                        <ICDropdown
                            className="icon-dim-12 fcn-0 dc__no-shrink rotate"
                            style={{ ['--rotateBy' as any]: isMenuOpen ? '180deg' : '0deg' }}
                        />
                    </PopupMenu.Button>
                    <PopupMenu.Body rootClassName={`pt-4 pb-4 dc__border dc__overflow-hidden ${popUpBodyClassName}`}>
                        {children}
                    </PopupMenu.Body>
                </PopupMenu>
            )}
        </div>
    )
}

export default ButtonWithSelector
