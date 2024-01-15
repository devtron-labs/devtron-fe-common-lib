import { FunctionComponent } from 'react'
import { BUILD_INFRA_TEXT } from './constants'
import { FooterProps } from './types'

const Footer: FunctionComponent<FooterProps> = ({ disabled }) => (
    <div className="flex pl pr pb pt h-64 dc__gap-12 dc__border-top dc__content-start">
        <button type="submit" className="cta submit h-32 flex" disabled={disabled}>
            {BUILD_INFRA_TEXT.EDIT_SUBMIT}
        </button>

        <button type="button" className="cta cancel h-32 flex" disabled={disabled}>
            {BUILD_INFRA_TEXT.EDIT_CANCEL}
        </button>
    </div>
)

export default Footer
